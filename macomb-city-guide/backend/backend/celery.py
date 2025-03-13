import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('macomb')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True, name="run_all_scrapers")
def run_all_scrapers(self):
    from django.core.management import call_command
    call_command('run_scrapers', type='all')

app.conf.beat_schedule = {
    'run-scrapers-daily': {
        'task': 'run_all_scrapers',
        'schedule': crontab(hour=2, minute=0),  # Run at 2:00 AM every day
        'args': (),
    },
}