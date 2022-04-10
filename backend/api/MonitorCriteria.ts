import express, {
    ExpressRequest,
    ExpressResponse,
} from 'common-server/utils/Express';
const router = express.getRouter();

const getUser = require('../middlewares/user').getUser;

import MonitorCriteriaService from '../services/monitorCriteriaService';

import {
    sendErrorResponse,
    sendItemResponse,
} from 'common-server/utils/response';
import Exception from 'common/Types/Exception/Exception';

router.get('/', getUser, (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const criteria = MonitorCriteriaService.getCriteria();
        return sendItemResponse(req, res, criteria);
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

export default router;
