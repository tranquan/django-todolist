from django.db import models


class TodoItem(models.Model):
    title = models.CharField(max_length=500)
    description = models.CharField(max_length=2000)
