import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsfeedComponent } from './dashboard/newsfeed/newsfeed.component';
import { WallComponent } from './dashboard/wall/wall.component';
import { ExploreComponent } from './dashboard/explore/explore.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: DashboardComponent,
        children: [
            {
                path: '', component: NewsfeedComponent,
            },
            { path: 'wall', component: WallComponent },
            { path: 'wall/:userId', component: WallComponent },
            { path: 'search/:keyword', component: ExploreComponent }
        ]
    },
];
