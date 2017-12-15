from rest_framework import pagination


class IdPagination(pagination.CursorPagination):
    ordering = ('-id')
    page_size = 100


class CustomPagePagination(pagination.PageNumberPagination):
    page_query_param = 'page'
    page_size_query_param = 'rows'
    max_page_size = 100
    page_size = 20
