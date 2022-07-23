import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AuthService,
  MasterService,
  PreloaderService,
  TaskService,
  TimesheetService,
  TokenService,
  User,
} from '@core';
import { environment } from '@env/environment';
import { filter, keys, sortBy, keyBy } from 'lodash';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css'],
})
export class MyPageComponent implements OnInit, AfterViewInit {
  currentUser: User | undefined;
  summaryBox: any = [];
  risk_list: any = [];
  issue_list: any = [];
  load_risk_list = false;
  filteredRiskList = [];
  currentRiskListPage = 1;
  maxSize = 10;
  load_issue_list = false;
  currentIssueListPage = 1;
  filteredIssueList = [];
  projects: any = [];
  projects_option: any = [];
  task_all: any = [];
  taskStatus: any = [];
  task_inprogress: any = [];
  tasks: any = [];
  currentTasksPage = 1;
  filteredTasks: any = [];

  constructor(
    private preloader: PreloaderService,
    private auth: AuthService,
    private tokenService: TokenService,
    private masterService: MasterService,
    private taskService: TaskService,
    private timesheetService: TimesheetService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenService.currentUser();
    this.summaryBox = [
      { title: 'my_page.my_task', class: 'fa fa-tasks text-blue fa-1', value: 0, link: '' },
      {
        title: 'my_page.in_progress_task',
        class: 'fa fa-spinner text-warning fa-1',
        value: 0,
        link: '',
      },
      {
        title: 'my_page.i_am_pm',
        class: 'fa fa-folder text-danger fa-1',
        value: 0,
        link: this.currentUser?.isPM ? 'iampm' : '',
      },
      {
        title: 'my_page.my_collab_project',
        class: 'fa fa-folder-open text-purple fa-1',
        value: 0,
        link: 'myproject',
      },
    ];

    this.getProject();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }

  getProject() {
    this.auth
      .userProfile('&includes[]=activeProjects.risks&includes[]=activeProjects.issues')
      .subscribe({
        next: res => {
          if (res.data.active_projects.length != 0) {
            const my_projects = filter(res.data.active_projects, project => {
              return (
                project.project_manager_user_aid == this.currentUser?.profile?.aid &&
                project.status_cid != 'CL' &&
                project.status_cid != 'DL'
              );
            });

            const my_collab_projects = filter(res.data.active_projects, function (project) {
              return project.status_cid != 'CL' && project.status_cid != 'DL';
            });

            const profile_aid = this.currentUser?.profile.aid;

            for (const i in my_collab_projects) {
              for (const j in my_collab_projects[i].risks) {
                this.risk_list.push(my_collab_projects[i].risks[j]);
              }
              const risk_list = this.risk_list;

              for (const j in my_collab_projects[i].issues) {
                this.issue_list.push(my_collab_projects[i].issues[j]);
              }
              const issue_list = this.issue_list;
            }

            if (profile_aid) {
              this.risk_list = filter(this.risk_list, function (item) {
                return profile_aid == item.owner_user_aid;
              });
            }

            this.risk_list.forEach((risks: any) => {
              risks.critical_level_name = null;
              this.masterService
                .getByType('criticallevels/' + risks.critical_level)
                .subscribe((res: any) => {
                  risks.critical_level_name = res.data.name;
                });
            });

            if (profile_aid) {
              this.issue_list = filter(this.issue_list, item => profile_aid == item.owner_user_aid);
            }

            this.pageRiskListChanged();
            this.pageIssueListChanged();

            this.summaryBox[2].value = my_projects.length;
            this.summaryBox[3].value = my_collab_projects.length;

            this.projects = keyBy(my_collab_projects, 'aid');

            const temp_proj = [{ id: 0, lable: 'All' }];
            for (const i in my_collab_projects) {
              temp_proj.push({ id: my_collab_projects[i].aid, lable: my_collab_projects[i].name });
            }

            this.projects_option = temp_proj;

            const arr_aid = keys(this.projects);
            const data = {
              filter_groups: [
                {
                  filters: [
                    { key: 'project_aid', value: arr_aid, operator: 'in' },
                    { key: 'isMyTask', value: 'true', operator: 'eq' },
                  ],
                },
              ],
              sort: [{ key: 'task_name', direction: 'ASC' }],
              includes: ['timesheets', 'resources', 'resourcedailyplans'],
            };

            this.getTask(data);
          }
        },
        error: err => console.log(err),
      });
  }

  pageRiskListChanged() {
    const begin = (this.currentRiskListPage - 1) * this.maxSize,
      end = begin + this.maxSize;
    this.filteredRiskList = this.risk_list.slice(begin, end);
  }

  pageIssueListChanged() {
    const begin = (this.currentIssueListPage - 1) * this.maxSize,
      end = begin + this.maxSize;
    this.filteredIssueList = this.issue_list.slice(begin, end);
  }

  getTask(filters: any) {
    this.taskService.getByValue(filters).subscribe(res => {
      const today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();

      if (dd < 10) {
        dd = Number(`0${dd}`);
      }
      if (mm < 10) {
        mm = Number(`0${mm}`);
      }

      const today_date = yyyy + '-' + mm + '-' + dd;
      const data = filter(res.data, function (tasks) {
        return tasks.act_end_date == null || tasks.act_end_date == '0000-00-00';
      });
      this.summaryBox[0].value = 0;
      this.summaryBox[1].value = 0;
      const profile_aid = this.currentUser?.profile.aid;
      const Task = [];
      for (const i in data) {
        const temp = data[i];
        temp.resources.forEach((resource: any) => {
          if (profile_aid == resource.resource_user_aid) {
            temp.task_status = resource.task_status_aid;
            temp.task_resource_aid = resource.aid;

            this.taskStatus.forEach((taskStatus: any) => {
              if (taskStatus.aid == temp.task_status) {
                temp.task_status_name = taskStatus.name;
              }
            });

            temp.resourcedailyplans.forEach((resourcedailyplans: any) => {
              if (
                resourcedailyplans.planned_date == today_date &&
                resource.aid == resourcedailyplans.wbs_resource_aid
              ) {
                temp.resourcedailyplans_aid = resourcedailyplans.aid;
              }
            });
          }
        });
        temp.resourcedailyplans_selected = false;
        temp.resourcedailyplans_selected_for_service = false;
        temp.resourcedailyplans.forEach((resourcedailyplans: any) => {
          if (
            profile_aid == resourcedailyplans.resource_user_aid &&
            resourcedailyplans.planned_date == today_date
          ) {
            temp.resourcedailyplans_selected = true;
            temp.resourcedailyplans_selected_for_service = true;
          }
        });
        if (this.projects[data[i].project_aid].status_cid == 'AP') {
          temp.project = this.projects[data[i].project_aid];
          this.summaryBox[0].value = this.summaryBox[0].value + 1;
          if (temp.project.act_start_date) {
            this.summaryBox[0].value = this.summaryBox[0].value + 1;
          }
          Task.push(temp);
        }
      }

      this.tasks = sortBy(Task, function (data) {
        return !data.resourcedailyplans_selected_for_service;
      });

      this.tasks.forEach((tasklist: any) => {
        if (tasklist.task_status_name == 'In Progress') {
          this.task_inprogress.push(tasklist.task_status);
        }
      });
      this.summaryBox[1].value = this.task_inprogress.length;
      this.task_all = Task;
      this.pageTasksChanged();
      this.selectedTasks();
    });
  }

  pageTasksChanged() {
    const begin = (this.currentTasksPage - 1) * this.maxSize,
      end = begin + this.maxSize;
    this.filteredTasks = this.tasks.slice(begin, end);

    const arr_status_ap = environment.STATUS.status_timesheet_ap;
    const arr_status_sp = environment.STATUS.status_timesheet_sp;

    this.filteredTasks.forEach((tasks: any) => {
      const data = {
        filter_groups: [{ filters: [{ key: 'wbs_aid', value: tasks.aid, operator: 'eq' }] }],
      };
      let each_sum_hours_ap = 0.0;
      let each_sum_hours_sp = 0.0;

      this.timesheetService.getAllTasks(data).subscribe(
        res => {
          res.data.forEach((timesheets: any) => {
            const arr_data_ap = arr_status_ap.filter(function (item) {
              return item.status === timesheets.status;
            })[0];

            if (!arr_data_ap) {
              each_sum_hours_ap = 0.0;
            } else {
              each_sum_hours_ap += parseFloat(timesheets.hours);
            }

            const arr_data_sp = arr_status_sp.filter(function (item) {
              return item.status === timesheets.status;
            })[0];
            if (!arr_data_sp) {
              each_sum_hours_sp = 0.0;
            } else {
              each_sum_hours_sp += parseFloat(timesheets.hours);
            }
          });
          tasks.sum_hours_ap = each_sum_hours_ap.toFixed(2);
          tasks.sum_hours_sp = each_sum_hours_sp.toFixed(2);
        },
        function (err) {
          if (err.status == 404) {
            tasks.sum_hours_ap = each_sum_hours_ap.toFixed(2);
            tasks.sum_hours_sp = each_sum_hours_sp.toFixed(2);
          }
        }
      );
    });

    this.filteredTasks = filter(this.filteredTasks, function (item) {
      return item.resourcedailyplans_selected_for_service != true;
    });
  }

  tasksSelected: any = [];
  showDiv = false;
  selectedTasks() {
    this.tasksSelected = filter(this.tasks, function (item) {
      return item.resourcedailyplans_selected_for_service == true;
    });
    if (this.tasksSelected.length != 0) {
      this.showDiv = true;
    }
  }
}
