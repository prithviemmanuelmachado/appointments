from django.urls import path, include
from rest_framework_nested import routers
from .views import AppointmentViewSet, NoteViewSet, dashboard, CalendarView, get_todays_appointments

#route for /appointments/
router = routers.DefaultRouter()
router.register(
    r'', 
    AppointmentViewSet,
    basename = ''
)

appointment_router = routers.NestedDefaultRouter(router, '', lookup = 'appointment')
#nested route for /appointments/<appointment_pk>/notes/
appointment_router.register(
    'notes', 
    NoteViewSet,
    basename = 'appointment-note'
)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(appointment_router.urls)),
    path('calendar', CalendarView.as_view()),
    path('stats', dashboard),
    path('today', get_todays_appointments)
]
