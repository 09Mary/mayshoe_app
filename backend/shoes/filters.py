import django_filters
from .models import Shoe


class ShoeFilter(django_filters.FilterSet):
    search   = django_filters.CharFilter(method='filter_search')
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    brand    = django_filters.CharFilter(field_name='brand',    lookup_expr='iexact')
    color    = django_filters.CharFilter(field_name='color',    lookup_expr='iexact')

    class Meta:
        model  = Shoe
        fields = ['category', 'brand', 'color']

    def filter_search(self, queryset, name, value):
        return queryset.filter(name__icontains=value) | queryset.filter(brand__icontains=value)