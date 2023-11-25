# from FacilityManagement.facility import facility
from . import views
from django.urls import path
# from .views import put
app_name ='facility'

urlpatterns =[
    path('get-facility/', views.get_facility, name='get_facility'),
    path('facility', views.display_facility, name='facility'),
    path('updatefaci', views.display_facility, name='updatefaci'),
    path('rules', views.rules_facility, name='rules'),
    path('deleteFacility/<int:id>', views.delete_facility, name='deleteFacility'),
    path('updateFacility/<int:id>', views.update_facility, name='updatefacility'),
    path('facilitytable', views.displayall_setting_facility, name='facilitytable'), 

    # path('sessfaci/<int:id>', views.set_session_facility, name='sessfaci'),
# facilitymainrules_back
    path('facimainback', views.facilitymainrules_back, name='facimainback'),
    
    path('facilityRules/<int:id>', views.display_facility_mainrules, name='facilityRules'),
    path('delfmrules/<int:id>', views.delete_facilitymainrules, name='delfmrules'),    
    path('setfmstatus/<int:id>', views.facilitymainrules_set, name='setfmstatus'),
    path('delfmstatus/<int:id>', views.delete_setfacilitymainrules_status, name='delfmstatus'),
    path('delfprules/<int:id>', views.delete_facilitypromorules, name='delfprules'), 
    path('delfsrules/<int:id>', views.delete_facilitysubrules, name='delfsrules'), 



# status to 1
    path('setfmstatus_one/', views.is_setfacilitymainrules_status, name='setfmstatus_one'),
    # path('userMainRules/<int:id>', views.display_user_mainrules, name='userMainRules'),
    path('user', views.user_create, name='user'),
    
    path('settingfacility', views.display_setting_facility, name='settingfacility'),
    path('updatesettingfacility/<int:id>', views.update_setting_facility, name='settingfacility'),

    path('facilitySubrules/<int:id>', views.display_facility_subrules, name='facilitysubrules'),
    path('setfsstatus_one/', views.is_setfacilitysubrules_status, name='setfsstatus_one'),
    path('setfsstatus/<int:id>', views.facilitysubrules_set, name='setfsstatus'),
    path('delfsstatus/<int:id>', views.delete_setfacilitysubrules_status, name='delfsstatus'),

    path('facilityPromrules/<int:id>', views.display_facility_promorules, name='facilitypromorules'),
    path('setfpstatus_one/', views.is_setfacilitypromorules_status, name='setfpstatus_one'),
    path('setfpstatus/<int:id>', views.facilitypromorules_set, name='setfpstatus'),
    path('delfpstatus/<int:id>', views.delete_setfacilitypromorules_status, name='delfpstatus'),

    path('calendar', views.display_calendar, name='calendar'),
    path('delevent/<int:id>', views.delete_event, name='delevent'),
    
    path('calendarview', views.display_calendarview, name='calendarview'),
    
    path('dashboard', views.revenue_dashboard, name='revenuedashboard'),
    path('report', views.revenue_report, name='revenuereport'),
    # path('revenue_dis', views.revenue_dashboard_copy, name='revenue_dis'),
# 
    path('get_events/', views.get_events, name='get_events'),
    path('generate_pdf/', views.generate_pdf, name='generate_pdf'),


# user type mainrules urls
    path('updateUmainrules/<int:id>', views.update_userMainRules, name='updateumainrules'),
    path('usertable', views.displayall_setting_usertype, name='usertable'), 
    path('delumrules/<int:id>', views.delete_usermainrules, name='delumrules'),    
    path('setumstatus/<int:id>', views.usertypemainrules_set, name='setumstatus'),
    path('delumstatus/<int:id>', views.delete_setusermainrules_status, name='delumstatus'),
    path('setumstatus_one/', views.is_setusermainrules_status, name='setumstatus_one'),
    path('userRules/<int:id>', views.display_usertype_mainrules, name='userRules'),
# user type subrules url
    path('updateUsubrules/<int:id>', views.update_userSubRules, name='updateusubrules'),
    path('delusrules/<int:id>', views.delete_usersubrules, name='delusrules'),    
    path('setusstatus/<int:id>', views.usertypesubrules_set, name='setusstatus'),
    path('delusstatus/<int:id>', views.delete_setusersubrules_status, name='delusstatus'),
    path('setusstatus_one/', views.is_setusersubrules_status, name='setusstatus_one'),
    path('userSubRules/<int:id>', views.display_usertype_subrules, name='userSubRules'),

    path('updateUpromorules/<int:id>', views.update_userPromoRules, name='updateupromorules'),
    path('deluprules/<int:id>', views.delete_userpromorules, name='deluprules'),    
    path('setupstatus/<int:id>', views.usertypepromorules_set, name='setupstatus'),
    path('delupstatus/<int:id>', views.delete_setuserpromorules_status, name='delupstatus'),
    path('setupstatus_one/', views.is_setuserpromorules_status, name='setupstatus_one'),
    path('userPromoRules/<int:id>', views.display_usertype_promorules, name='userPromoRules'),

    path('umainback', views.usertypemainrules_back, name='umainback'),
]