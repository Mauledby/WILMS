from django.db import models

# Create your models here.
class AdminAccountModel(models.Model):
    username = models.CharField(max_length=20);
    password = models.CharField(max_length=20);
        
    def __str__(self):
        return self.username;
    
class AdminReportLogsModel(models.Model):
    logid = models.AutoField(primary_key=True);
    referenceid = models.CharField(max_length=20);
    userid = models.CharField(max_length=20);
    starttime = models.CharField(max_length=100);
    endtime = models.CharField(max_length=100);
    status = models.CharField(max_length=20);
        
    def __str__(self):
        return self.userid+"-"+self.referenceid+"-"+self.status;
    
class WalkinBookingModel(models.Model):
    bookingid = models.AutoField(primary_key=True);
    referenceid = models.CharField(max_length=20);
    userid = models.CharField(max_length=20);
    start_time = models.DateTimeField(null=True);
    end_time = models.DateTimeField(null=True);
    isOverstaying = models.IntegerField(null=False, default=0);
    isTimeEnd = models.IntegerField(null=False, default=0);
    status = models.CharField(max_length=20);
        
    def __str__(self):
        return self.userid+"-"+self.referenceid;