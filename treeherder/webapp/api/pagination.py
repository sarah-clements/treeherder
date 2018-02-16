from rest_framework import pagination
from rest_framework.response import Response


class IdPagination(pagination.CursorPagination):
    ordering = ('-id')
    page_size = 100


class CustomPagePagination(pagination.PageNumberPagination):
    page_query_param = 'page'
    page_size_query_param = 'rows'
    max_page_size = 100
    page_size = 20

    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })
