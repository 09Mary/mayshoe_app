from django.contrib import admin
from django.utils.html import format_html
from .models import Shoe, ShoeSize


class ShoeSizeInline(admin.TabularInline):
    """
    Inline table — add/edit all sizes and stock quantities directly
    on the shoe page. One row = one size.
    """
    model   = ShoeSize
    extra   = 3
    fields  = ('size', 'stock')
    ordering = ('size',)


@admin.register(Shoe)
class ShoeAdmin(admin.ModelAdmin):
    inlines = [ShoeSizeInline]

    list_display = (
        'thumbnail', 'name', 'color', 'brand', 'category',
        'price', 'stock_summary', 'is_new_launch', 'is_timely_shop', 'is_active',
    )
    list_display_links = ('thumbnail', 'name')
    list_filter        = ('category', 'is_new_launch', 'is_timely_shop', 'is_active', 'brand')
    search_fields      = ('name', 'brand', 'color')
    list_editable      = ('is_new_launch', 'is_timely_shop', 'is_active')

    fieldsets = (
        ('Basic info', {
            'fields': ('name', 'brand', 'color', 'category', 'price', 'description', 'image'),
        }),
        ('Homepage curation', {
            'description': (
                '⭐ New Launch — features this shoe in the homepage spotlight (only one at a time). '
                '🕐 Timely Shop — adds this shoe to the featured strip. '
                'Date fields are optional; leave blank to always show.'
            ),
            'fields': ('is_new_launch', 'is_timely_shop', 'availability_start', 'availability_end'),
        }),
        ('Visibility', {
            'fields': ('is_active',),
        }),
    )

    # ── Custom columns ────────────────────────────────────────────────────────
    @admin.display(description='Image')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" />',
                obj.image.url,
            )
        return '—'

    @admin.display(description='Stock by size')
    def stock_summary(self, obj):
        sizes = obj.sizes.all()
        if not sizes:
            return format_html('<span style="color:red;font-weight:600">No sizes added</span>')

        total = sum(s.stock for s in sizes)
        color = 'red' if total == 0 else 'orange' if total <= 5 else 'green'

        # Show compact size:qty breakdown
        breakdown = '  '.join(
            f'<span style="color:{"red" if s.stock==0 else "inherit"}">'
            f'{s.size}→{s.stock}</span>'
            for s in sizes
        )
        return format_html(
            '<span style="color:{};font-weight:600">Total: {}</span><br>'
            '<small style="color:#888">{}</small>',
            color, total, breakdown,
        )

    # ── Ensure only one New Launch at a time ──────────────────────────────────
    def save_model(self, request, obj, form, change):
        if obj.is_new_launch:
            Shoe.objects.exclude(pk=obj.pk).filter(is_new_launch=True).update(is_new_launch=False)
        super().save_model(request, obj, form, change)


@admin.register(ShoeSize)
class ShoeSizeAdmin(admin.ModelAdmin):
    """
    Standalone view — useful for quickly restocking specific sizes
    without opening each shoe individually.
    """
    list_display  = ('shoe', 'size', 'stock', 'stock_status')
    list_filter   = ('shoe', 'size')
    search_fields = ('shoe__name', 'shoe__color', 'size')
    list_editable = ('stock',)
    ordering      = ('shoe__name', 'size')

    @admin.display(description='Status')
    def stock_status(self, obj):
        if obj.stock == 0:
            return format_html('<span style="color:red;font-weight:600">Out of stock</span>')
        if obj.stock <= 3:
            return format_html('<span style="color:orange;font-weight:600">Low ({} left)</span>', obj.stock)
        return format_html('<span style="color:green">In stock</span>')