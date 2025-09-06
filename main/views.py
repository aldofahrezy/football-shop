from django.shortcuts import render

# Create your views here.
def show_main(request):
    context = {
        'nama': 'Muhammad Aldo Fahrezy',
        'npm': '2406423055',
        'kelas': 'PBP C',
        'project_name': 'The Kickoff Zone',
    }

    return render(request, "main.html", context)