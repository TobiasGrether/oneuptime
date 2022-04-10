import express, {
    ExpressRequest,
    ExpressResponse,
} from 'common-server/utils/Express';
import ReportService from '../services/reportService';

import { isAuthorized } from '../middlewares/authorization';
const getUser = require('../middlewares/user').getUser;
const getSubProjects = require('../middlewares/subProject').getSubProjects;
import { sendErrorResponse } from 'common-server/utils/response';
import Exception from 'common/Types/Exception/Exception';

import { sendListResponse } from 'common-server/utils/response';
const router = express.getRouter();

/**
 * @Routes
 * @description get names of most active members to resolve incidents
 * @param Param 1: req.headers-> {authorization}; req.user-> {id}; req.params-> {projectId}
 * @returns { Array } an array of members ordered by number of incidents resolved
 */
router.get(
    '/:projectId/active-members',
    getUser,
    isAuthorized,
    getSubProjects,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { startDate, endDate, skip, limit } = req.query;

            const subProjectIds = req.user.subProjects
                ? req.user.subProjects.map((project: $TSFixMe) => project._id)
                : null;
            // Call ReportService
            const members = await ReportService.getMostActiveMembers(
                subProjectIds,
                startDate,
                endDate,
                skip,
                limit
            );

            const count = members.count;

            return sendListResponse(req, res, members.members, count);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

/**
 * @Route
 * @description route to fetch most active monitors
 * @param Param 1: req.headers-> {authorization}; req.user-> {id}; req.params-> {projectId}
 * @returns { Array } an array of monitors orderedby number of incidents
 */
router.get(
    '/:projectId/active-monitors',
    getUser,
    isAuthorized,
    getSubProjects,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { startDate, endDate, skip, limit } = req.query;

            const subProjectIds = req.user.subProjects
                ? req.user.subProjects.map((project: $TSFixMe) => project._id)
                : null;
            // Call Reports Service
            const monitors = await ReportService.getMostActiveMonitors(
                subProjectIds,
                startDate,
                endDate,
                skip,
                limit
            );

            const count = monitors.count;

            return sendListResponse(req, res, monitors.monitors, count);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

/**
 * @Route
 * @description route to fetch average time to resolve incidents by filter
 * @param Param 1: req.headers-> {authorization}; req.user-> {id}; req.params-> {projectId}
 * @returns { Array } an array of monitors orderedby number of incidents
 */
router.get(
    '/:projectId/average-resolved',
    getUser,
    isAuthorized,
    getSubProjects,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { startDate, endDate, filter } = req.query;

            const subProjectIds = req.user.subProjects
                ? req.user.subProjects.map((project: $TSFixMe) => project._id)
                : null;
            // Reports Service
            const resolveTime = await ReportService.getAverageTimeBy(
                subProjectIds,
                startDate,
                endDate,
                filter
            );
            return sendListResponse(req, res, resolveTime);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

/**
 * @Route
 * @description route to fetch incidents count by filter
 * @param Param 1: req.headers-> {authorization}; req.user-> {id}; req.params-> {projectId}
 * @returns { Array } an array of incidents count
 */
router.get(
    '/:projectId/incidents',
    getUser,
    isAuthorized,
    getSubProjects,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { startDate, endDate, filter } = req.query;

            const subProjectIds = req.user.subProjects
                ? req.user.subProjects.map((project: $TSFixMe) => project._id)
                : null;
            // Reports Service
            const incidents = await ReportService.getIncidentCountBy(
                subProjectIds,
                startDate,
                endDate,
                filter
            );
            return sendListResponse(req, res, incidents);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

export default router;
