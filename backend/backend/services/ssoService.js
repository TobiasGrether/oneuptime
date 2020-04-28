module.exports = {
    getAllSsos: async function (skip, limit) {
        if (!skip) skip = 0;

        if (!limit) limit = 0;

        if (typeof skip === 'string') skip = parseInt(skip);

        if (typeof limit === 'string') limit = parseInt(limit);

        try {
            const ssos = await SsoModel.find(
                {},
                { _id: 1, domain: 1, createdAt: 1 })
                .sort([['createdAt', -1]])
                .skip(skip)
                .limit(limit);
            return ssos;
        } catch (error) {
            ErrorService.log('ssoService.deleteSso', error);
            throw error;
        }
    },
    deleteSso: async function (ssoId) {
        try {
            const result = await SsoModel.deleteOne({ _id: ssoId });
            const { ok, deletedCount } = result;
            if (!ok || !deletedCount)
                throw {
                    code: 400,
                    message: 'Failed to remove the sso.'
                }
        } catch (error) {
            ErrorService.log('ssoService.deleteSso', error);
            throw error;
        }
    },
    createSso: async function (data) {
        const sso = new SsoModel();
        sso["saml-enabled"] = data["saml-enabled"] || false
        sso.domain = data.domain
        sso.samlSsoUrl = data.samlSsoUrl
        sso.certificateFingerprint = data.certificateFingerprint
        sso.remoteLogoutUrl = data.remoteLogoutUrl
        sso.ipRanges = data.ipRanges
        sso.createdAt = new Date()
        try {
            await sso.save()
        } catch (error) {
            ErrorService.log('ssoService.deleteCreate', error);
            throw error;
        }
    },
    getSso: async function (ssoId) {
        try {
            const sso = await SsoModel.findOne({ _id: ssoId });
            if (!sso)
                throw {
                    code: 404,
                    message: 'SSO not found.'
                }
            return sso;
        } catch (error) {
            ErrorService.log('ssoService.getSso', error);
            throw error;
        }
    },
    updateSso: async function (ssoId, data) {
        try {
            const sso = await SsoModel.findOne({ _id: ssoId });
            if (!sso)
                throw {
                    code: 404,
                    message: 'SSO not found.'
                }
            sso["saml-enabled"] = data["saml-enabled"] || false
            sso.domain = data.domain
            sso.samlSsoUrl = data.samlSsoUrl
            sso.certificateFingerprint = data.certificateFingerprint
            sso.remoteLogoutUrl = data.remoteLogoutUrl
            sso.ipRanges = data.ipRanges
            sso.createdAt = new Date()
            await sso.save();
        } catch (error) {
            ErrorService.log('ssoService.getSso', error);
            throw error;
        }
    },
    getCount: async function () {
        const count = await SsoModel.countDocuments({});
        return count;
    }
}

const SsoModel = require('../models/sso');
const ErrorService = require('./errorService');