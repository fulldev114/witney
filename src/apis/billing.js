import { NativeModules, Platform } from 'react-native';
import InAppBilling from 'react-native-billing';
import iapReceiptValidator from 'iap-receipt-validator';

import CONFIG from '@src/config';

const { InAppUtils } = NativeModules;
const { INAPP_BILLING: INAPP_BILLING_CONFIG } = CONFIG;

const BillingApi = {
  isSubscribed: async (success = () => {}, fail = () => {}, error = (e) => { console.log(e); }) => {
    if (Platform.OS === 'android') {
      try {
        await InAppBilling.close();
        await InAppBilling.open();
        await InAppBilling.loadOwnedPurchasesFromGoogle();
        const values = await Promise.all([
          InAppBilling.isSubscribed(INAPP_BILLING_CONFIG.PLAN_MONTHLY),
          InAppBilling.isSubscribed(INAPP_BILLING_CONFIG.PLAN_3MONTHS),
        ]);
        if (values[0] || values[1]) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        error(e);
      }
    } else {
      InAppUtils.receiptData(async (e, receiptData) => {
        if (e) {
          error(e);
          return;
        }
        const password = INAPP_BILLING_CONFIG.ITUNE_CONNECT_SHARED_SECRET;
        const production = true;
        const validateReceipt = iapReceiptValidator(password, production);
        const validationData = await validateReceipt(receiptData);
        const now = new Date();
        const expires_date = new Date(validationData.latest_receipt_info[0].expires_date);
        if (expires_date > now) {
          success();
        } else {
          fail();
        }
      });
    }
  },

  loadProducts(callback) {
    const identifiers = [
      INAPP_BILLING_CONFIG.PLAN_MONTHLY,
      INAPP_BILLING_CONFIG.PLAN_3MONTHS,
    ];
    if (Platform.OS === 'ios') {
      InAppUtils.loadProducts(identifiers, callback);
    } else {
      callback(null, identifiers);
    }
  },

  subscribe: async (productId, success = () => {}, fail = () => {}, error = (e) => { console.log(e); }) => {
    if (Platform.OS === 'android') {
      try {
        await InAppBilling.close();
        await InAppBilling.open();
        const purchaseState = await InAppBilling.subscribe(productId);
        if (purchaseState === 'PurchasedSuccessfully') {
          success();
        } else {
          fail();
        }
      } catch (e) {
        error(e);
      }
    } else {
      InAppUtils.purchaseProduct(productId, (e, response) => {
        if (e) {
          console.log('productError', error);
          error(e);
          return;
        }
        console.log('productReceived', response);
        if (response && response.productId) {
          success();
        } else {
          fail();
        }
      });
    }
  },
};

export default BillingApi;
