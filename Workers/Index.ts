import { PostgresAppInstance } from 'CommonServer/Infrastructure/PostgresDatabase';
import Redis from 'CommonServer/Infrastructure/Redis';
import logger from 'CommonServer/Utils/Logger';
import App from 'CommonServer/Utils/StartServer';
import { QueueJob, QueueName } from 'CommonServer/Infrastructure/Queue';
import QueueWorker from 'CommonServer/Infrastructure/QueueWorker';

// Payments.
import './Jobs/PaymentProvider/CheckSubscriptionStatus';
import './Jobs/PaymentProvider/UpdateTeamMembersIfNull';
import './Jobs/PaymentProvider/PopulatePlanNameInProject';

// Announcements.
import './Jobs/Announcement/SendEmailToSubscribers';

// Incidents
import './Jobs/Incident/SendEmailToSubscribers';
import './Jobs/IncidentStateTimeline/SendEmailToSubscribers';

// Incident Notes
import './Jobs/IncidentPublicNote/SendEmailToSubscribers';

// Hard Delete
import './Jobs/HardDelete/HardDeleteItemsInDatabase';

// Scheduled Event
import './Jobs/ScheduledMaintenance/ChangeStateToOngoing';
import './Jobs/ScheduledMaintenance/SendEmailToSubscribers';
import './Jobs/ScheduledMaintenanceStateTimeline/SendEmailToSubscribers';

// Scheduled Event Notes
import './Jobs/ScheduledMaintenancePublicNote/SendEmailToSubscribers';

// Certs Routers
import StatusPageCerts from './Jobs/StatusPageCerts/StatusPageCerts';

// Express
import Express, { ExpressApplication } from 'CommonServer/Utils/Express';
import JobDictonary from './Utils/JobDictionary';

// Monitor Owners
import './Jobs/MonitorOwners/SendCreatedResourceEmail';
import './Jobs/MonitorOwners/SendOwnerAddedEmail';
import './Jobs/MonitorOwners/SendStatusChangeEmail';

// Incident Owners
import './Jobs/IncidentOwners/SendCreatedResourceEmail';
import './Jobs/IncidentOwners/SendOwnerAddedEmail';
import './Jobs/IncidentOwners/SendStateChangeEmail';
import './Jobs/IncidentOwners/SendNotePostedEmail';

// Scheduled Event Owners
import './Jobs/ScheduledMaintenanceOwners/SendCreatedResourceEmail';
import './Jobs/ScheduledMaintenanceOwners/SendOwnerAddedEmail';
import './Jobs/ScheduledMaintenanceOwners/SendStateChangeEmail';
import './Jobs/ScheduledMaintenanceOwners/SendNotePostedEmail';

// Status Page Owners
import './Jobs/StatusPageOwners/SendCreatedResourceEmail';
import './Jobs/StatusPageOwners/SendOwnerAddedEmail';
import './Jobs/StatusPageOwners/SendAnnouncementCreatedEmail';
import RunDatabaseMigrations from './Utils/DataMigration';

// On Call Duty Policy Executions.
import './Jobs/OnCallDutyPolicyExecutionLog/ExecutePendingExecutions';
import './Jobs/OnCallDutyPolicyExecutionLog/TimeoutStuckExecutions';

// User Notifications Log
import './Jobs/UserNotificationLog/ExecutePendingExecutions';
import './Jobs/UserNotificationLog/TimeoutStuckExecutions';

const APP_NAME: string = 'workers';

const app: ExpressApplication = Express.getExpressApp();

//cert routes.
app.use(`/${APP_NAME.toLocaleLowerCase()}`, StatusPageCerts);

const init: Function = async (): Promise<void> => {
    try {
        // init the app
        await App(APP_NAME);
        // connect to the database.
        await PostgresAppInstance.connect(
            PostgresAppInstance.getDatasourceOptions()
        );

        // connect redis
        await Redis.connect();

        await RunDatabaseMigrations();

        // Job process.
        QueueWorker.getWorker(
            QueueName.Worker,
            async (job: QueueJob) => {
                const name: string = job.name;

                logger.info('Running Job: ' + name);

                const funcToRun: Function = JobDictonary.getJobFunction(name);

                if (funcToRun) {
                    await funcToRun();
                }
            },
            { concurrency: 10 }
        );
    } catch (err) {
        logger.error('App Init Failed:');
        logger.error(err);
    }
};

init();
