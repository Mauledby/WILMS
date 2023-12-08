# from FacilityManagement.facility import facility
from . import views
from django.urls import path
# from .views import put
app_name ='facility'

urlpatterns =[
    path('get-facility/', views.get_facility, name='get_facility'),
    path('facilitymanagement', views.display_facility, name='facility'),
    path('facilitymanagement/updatefaci', views.display_facility, name='updatefaci'),
    path('rules', views.rules_facility, name='rules'),
    path('facilitymanagement/deleteFacility/<int:id>', views.delete_facility, name='deleteFacility'),
    path('facilitymanagement/updateFacility/<int:id>', views.update_facility, name='updatefacility'),
    path('facilitymanagement/frules/facilitytable', views.displayall_setting_facility, name='facilitytable'), 

    # path('sessfaci/<int:id>', views.set_session_facility, name='sessfaci'),
# facilitymainrules_back
    path('facilitymanagement/frules/facimainback', views.facilitymainrules_back, name='facimainback'),
    
    path('facilitymanagement/frules/facilityRules/<int:id>', views.display_facility_mainrules, name='facilityRules'),
    path('facilitymanagement/frules/facilitydelfmrules/<int:id>', views.delete_facilitymainrules, name='delfmrules'),    
    path('facilitymanagement/frules/facilitysetfmstatus/<int:id>', views.facilitymainrules_set, name='setfmstatus'),
    path('facilitymanagement/frules/facilitydelfmstatus/<int:id>', views.delete_setfacilitymainrules_status, name='delfmstatus'),
    path('facilitymanagement/frules/facilitydelfprules/<int:id>', views.delete_facilitypromorules, name='delfprules'), 
    path('facilitymanagement/frules/facilitydelfsrules/<int:id>', views.delete_facilitysubrules, name='delfsrules'), 



# status to 1
    path('facilitymanagement/frules/facilitysetfmstatus_one/', views.is_setfacilitymainrules_status, name='setfmstatus_one'),
    # path('userMainRules/<int:id>', views.display_user_mainrules, name='userMainRules'),
    path('user', views.user_create, name='user'),
    
    path('rulessummary', views.display_setting_facility, name='rulessummary'),
    path('facilitymanagement/frules/updatesettingfacility/<int:id>', views.update_setting_facility, name='settingfacility'),

    path('facilitymanagement/frules/facilitySubrules/<int:id>', views.display_facility_subrules, name='facilitysubrules'),
    path('facilitymanagement/frules/facilitysetfsstatus_one/', views.is_setfacilitysubrules_status, name='setfsstatus_one'),
    path('facilitymanagement/frules/facilitysetfsstatus/<int:id>', views.facilitysubrules_set, name='setfsstatus'),
    path('facilitymanagement/frules/facilitydelfsstatus/<int:id>', views.delete_setfacilitysubrules_status, name='delfsstatus'),

    path('facilitymanagement/frules/facilityPromrules/<int:id>', views.display_facility_promorules, name='facilitypromorules'),
    path('facilitymanagement/frules/facilitysetfpstatus_one/', views.is_setfacilitypromorules_status, name='setfpstatus_one'),
    path('facilitymanagement/frules/facilitysetfpstatus/<int:id>', views.facilitypromorules_set, name='setfpstatus'),
    path('facilitymanagement/frules/facilitydelfpstatus/<int:id>', views.delete_setfacilitypromorules_status, name='delfpstatus'),

    path('facilitymanagement/calendar', views.display_calendar, name='calendar'),
    path('delevent/<int:id>', views.delete_event, name='delevent'),
    
    path('facilitymanagement/calendar/calendarview', views.display_calendarview, name='calendarview'),
    
    path('revenue/revenuedashboard', views.revenue_dashboard, name='revenuedashboard'),
    path('revenue/revenuereport', views.revenue_report, name='revenuereport'),
    # path('revenue_dis', views.revenue_dashboard_copy, name='revenue_dis'),
# 
    path('get_events/', views.get_events, name='get_events'),
    path('generate_pdf/', views.generate_pdf, name='generate_pdf'),


# user type mainrules urls
    path('facilitymanagement/urules/updateUmainrules/<int:id>', views.update_userMainRules, name='updateumainrules'),
    path('facilitymanagement/urules/usertable', views.displayall_setting_usertype, name='usertable'), 
    path('facilitymanagement/urules/delumrules/<int:id>', views.delete_usermainrules, name='delumrules'),    
    path('facilitymanagement/urules/setumstatus/<int:id>', views.usertypemainrules_set, name='setumstatus'),
    path('facilitymanagement/urules/delumstatus/<int:id>', views.delete_setusermainrules_status, name='delumstatus'),
    path('facilitymanagement/urules/setumstatus_one/', views.is_setusermainrules_status, name='setumstatus_one'),
    path('facilitymanagement/urules/userRules/<int:id>', views.display_usertype_mainrules, name='userRules'),
# user type subrules url
    path('facilitymanagement/urules/updateUsubrules/<int:id>', views.update_userSubRules, name='updateusubrules'),
    path('facilitymanagement/urules/delusrules/<int:id>', views.delete_usersubrules, name='delusrules'),    
    path('facilitymanagement/urules/setusstatus/<int:id>', views.usertypesubrules_set, name='setusstatus'),
    path('facilitymanagement/urules/delusstatus/<int:id>', views.delete_setusersubrules_status, name='delusstatus'),
    path('facilitymanagement/urules/setusstatus_one/', views.is_setusersubrules_status, name='setusstatus_one'),
    path('facilitymanagement/urules/userSubRules/<int:id>', views.display_usertype_subrules, name='userSubRules'),

    path('facilitymanagement/urules/updateUpromorules/<int:id>', views.update_userPromoRules, name='updateupromorules'),
    path('facilitymanagement/urules/deluprules/<int:id>', views.delete_userpromorules, name='deluprules'),    
    path('facilitymanagement/urules/setupstatus/<int:id>', views.usertypepromorules_set, name='setupstatus'),
    path('facilitymanagement/urules/delupstatus/<int:id>', views.delete_setuserpromorules_status, name='delupstatus'),
    path('facilitymanagement/urules/setupstatus_one/', views.is_setuserpromorules_status, name='setupstatus_one'),
    path('facilitymanagement/urules/userPromoRules/<int:id>', views.display_usertype_promorules, name='userPromoRules'),

    path('facilitymanagement/urules/umainback', views.usertypemainrules_back, name='umainback'),
]