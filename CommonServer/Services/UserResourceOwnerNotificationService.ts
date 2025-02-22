import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/UserResourceOwnerNotification';
import DatabaseService from './DatabaseService';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
    }
}
export default new Service();
