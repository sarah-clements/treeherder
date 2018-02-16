from django.db.models import Count, Subquery, IntegerField, OuterRef
from django.db.models.functions import TruncDate
from rest_framework import (generics, views)
from treeherder.model.models import (Bugscache, BugJobMap, Job, Push)
from .serializers import (FailuresSerializer, FailuresByBugSerializer, FailureCount)
from pagination import CustomPagePagination
from treeherder.etl.common import (_get_end_of_day, _get_tree)
from treeherder.config.settings import OPTION_COLLECTION_HASH_MAP


class Failures(generics.ListAPIView):
    """ List of intermittent failures by date range and tree (project name) """

    serializer_class = FailuresSerializer
    pagination_class = CustomPagePagination

    def get_queryset(self):
        startday = self.request.query_params.get('startday').encode('utf-8') + ' 00:00:00'
        endday = _get_end_of_day(self.request.query_params.get('endday').encode('utf-8'))
        tree = _get_tree(self.request.query_params.get('tree').encode('utf-8'))
        search = self.request.query_params.get('search')

        query = Bugscache.objects.filter(modified__range=(startday, endday))

        if search:
            queryset = query.filter(summary__icontains=search).order_by('modified')

        else:
            queryset = query.order_by()
        # queryset = Bugscache.objects.filter(job__push__time__range=(startday, endday), job__repository_id__in=tree).select_related()
        # count aggregate function
        return queryset


class FailuresByBug(generics.ListAPIView):
    """ List of intermittent failure details by bug, date range and tree (project name) """

    serializer_class = FailuresByBugSerializer
    pagination_class = CustomPagePagination

    def get_queryset(self):
        startday = self.request.query_params.get('startday').encode('utf-8') + ' 00:00:00'
        endday = _get_end_of_day(self.request.query_params.get('endday').encode('utf-8'))
        tree = _get_tree(self.request.query_params.get('tree').encode('utf-8'))
        bug_id = int(self.request.query_params.get('bug'))

        queryset = BugJobMap.objects.select_related('job', 'push').filter(bug_id=bug_id, job__repository_id__in=tree,
                                                                          job__push__time__range=(startday, endday))\
            .values('bug_id', 'job_id', 'job__push__time', 'job__repository__name', 'job__option_collection_hash',
                    'job__signature__job_type_name', 'job__push__revision', 'job__machine_platform__platform')

        for item in queryset:
            hash_lookup = OPTION_COLLECTION_HASH_MAP[item['job__option_collection_hash']]
            if hash_lookup:
                item['build_type'] = hash_lookup

        return queryset


class FailureCount(generics.ListAPIView):
    """ List of failures (optionally by bug) and testruns by day per date range and tree"""

    serializer_class = FailureCount

    def get_queryset(self):
        startday = self.request.query_params.get('startday').encode('utf-8') + ' 00:00:00'
        endday = _get_end_of_day(self.request.query_params.get('endday').encode('utf-8'))
        tree = _get_tree(self.request.query_params.get('tree').encode('utf-8'))
        bug_id = self.request.query_params.get('bug')

        push_query = Push.objects.filter(repository_id__in=tree, time__range=(startday, endday))\
             .annotate(date=TruncDate('time')).values('date')\
             .annotate(test_runs=Count('author')).order_by('date').values('date', 'test_runs')

        if bug_id:
            queryset = BugJobMap.objects.filter(job__repository_id__in=tree, job__push__time__range=(startday, endday),
                                                job__failure_classification__id=4, bug_id=int(bug_id))\
                .select_related('job', 'push').annotate(date=TruncDate('job__push__time'))\
                .values('date').annotate(failure_count=Count('id')).order_by('date').values('date', 'failure_count')
        else:
            queryset = Job.objects.select_related('push').filter(push__time__range=(startday, endday), repository_id__in=tree,
                                                           failure_classification_id=4)\
                .annotate(date=TruncDate('push__time'))\
                .values('date').annotate(failure_count=Count('id')).order_by('date').values('date', 'failure_count')

        # queryset = []
        for job, push in zip(queryset, push_query):
            # queryset.append(
            #     {'date': job['date'], 'failure_count': job['failure_count'], 'test_runs': push['test_runs']})
            if job['date'] == push['date']:
                job['test_runs'] = push['test_runs']
            else:
                job['test_runs'] = 0

        return queryset

