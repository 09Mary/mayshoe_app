
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='mpesa_checkout_request_id',
            field=models.CharField(blank=True, db_index=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='mpesa_receipt_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
