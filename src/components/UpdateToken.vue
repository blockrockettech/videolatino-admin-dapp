<template>
  <div class="txt">
    <h1 class="heading">Update General Product Token</h1>
    <hr/>
    <div class="alert alert-warning" v-if="!account || accountProperties.staticWeb3">You must "Login" to use this page.</div>
    <div class="alert alert-warning" v-else-if="!canAccountMint">
      It doesn't look like you have the permissions to update token information. Double check you're using the correct account.
    </div>
    <div v-else-if="canAccountMint">
      <div class="row">
        <div class="col">
          <b-form inline class="my-2">

            <b-input-group prepend="Token ID" class="mb-2 mr-sm-2 mb-sm-0 fixed-width-input">
              <b-input placeholder="1..."
                       v-model="tokenId">
              </b-input>
            </b-input-group>

            <b-button class="ml-2"
                      @click="performTokenSearch"
                      variant="primary"
                      v-if="!searching"
                      :disabled="!tokenId">
              Search
            </b-button>

            <b-button class="ml-2"
                      variant="primary"
                      v-if="searching && tokenId" disabled>
              <SmallSpinner/>
            </b-button>
          </b-form>
        </div>
      </div>
      <div v-if="ipfsData && ipfsDataRetrieved">
        <div class="row">
          <div class="col">
            <div class="my-3">
              <h3 class="text-left">Token Summary</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-lg-3">
            <b-card title="Name:" body-bg-variant="primary" class="text-white min-height-card">
              <b-card-body class="text-white">
                <div>
                  {{ipfsData.name}}
                </div>
              </b-card-body>
            </b-card>
          </div>
          <div class="col-md-4 col-lg-3">
            <b-card title="Token ID:" body-bg-variant="primary" class="text-white min-height-card">
              <b-card-body class="text-white">
                <div>
                  {{foundTokenId}}
                </div>
              </b-card-body>
            </b-card>
          </div>
          <div class="col-md-4 col-lg-3">
            <b-card title="Product ID:" body-bg-variant="primary" class="text-white min-height-card">
              <b-card-body class="text-white">
                <div>
                  {{ipfsData.attributes.product_id}}
                </div>
              </b-card-body>
            </b-card>
          </div>
          <div class="col-md-4 col-lg-3">
            <b-card no-body title="Image:" bg-variant="primary" class="text-white min-height-card p-1">
              <img :src="ipfsData.image" style="max-height: 150px;" class="m-auto"/>
            </b-card>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="my-4">
              <h3 class="text-left">Update Provenance Information</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <vue-form :state="formState" @submit.prevent="onSubmit">

              <div class="form-group row">
                <label for="purchLocation" class="col-sm-3 col-form-label text-right">Purchase Location</label>
                <div class="col-sm-9">
                  <input type="text"
                         name="purchLocation"
                         id="purchLocation"
                         class="form-control"
                         :class="inputClassName(formState.purchLocation)"
                         v-model="model.purchase_location"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="purchDate" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.purchase_date }">
                  Purchase Date
                </label>
                <div class="col-sm-9">
                  <datepicker name="purchDate"
                              id="purchDate"
                              placeholder="YYYY-MM-DD"
                              input-class="form-control bg-white"
                              :typeable="false"
                              :clear-button="true"
                              format="yyyy-MM-dd"
                              :disabled-dates="disabledDates()"
                              v-model="model.purchase_date">
                  </datepicker>
                </div>
              </div>

              <div class="form-group row required-field">
                <label for="customiseLocation" class="col-sm-3 col-form-label text-right">
                  Customization Location
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         name="customiseLocation"
                         id="customiseLocation"
                         class="form-control"
                         :class="inputClassName(formState.customiseLocation)"
                         v-model="model.customization_location"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="customiseDate" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.customization_date }">
                  Customization Date
                </label>
                <div class="col-sm-9">
                  <datepicker name="customiseDate"
                              id="customiseDate"
                              placeholder="YYYY-MM-DD"
                              input-class="form-control bg-white"
                              :typeable="false"
                              :clear-button="true"
                              :disabled-dates="disabledDates()"
                              format="yyyy-MM-dd"
                              v-model="model.customization_date">
                  </datepicker>
                </div>
              </div>

              <h4 class="heading text-left my-3">Materials Used</h4>

              <div class="form-group row">
                <label for="material1" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.material_1 }">
                  Material 1
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         name="material1"
                         maxlength="40"
                         id="material1"
                         class="form-control"
                         :class="inputClassName(formState.material1)"
                         v-model="model.material_1"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="material2" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.material_2 }">
                  Material 2
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         name="material2"
                         maxlength="40"
                         id="material2"
                         class="form-control"
                         v-model="model.material_2"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="material3" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.material_3 }">
                  Material 3
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         name="material3"
                         maxlength="40"
                         id="material3"
                         class="form-control"
                         v-model="model.material_3"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="material4" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.material_4 }">
                  Material 4
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         name="material4"
                         maxlength="40"
                         id="material4"
                         class="form-control"
                         v-model="model.material_4"/>
                </div>
              </div>

              <div class="form-group row">
                <label for="material5" class="col-sm-3 col-form-label text-right"
                       v-bind:class="{ 'text-success': model.material_5 }">
                  Material 5
                </label>
                <div class="col-sm-9">
                  <input type="text"
                         maxlength="40"
                         name="material5"
                         id="material5"
                         class="form-control"
                         v-model="model.material_5"/>
                </div>
              </div>

              <FormFooter
                :saving="saving"
                :transactionHash="transactionHash"
                :isActionBtnDisabled="isUpdateBtnDisabled"
                actionBtnTxt="Update"
                :formState="formState"
                :generalFormStateInvalid="isUpdateBtnDisabled"
                invalidFormStateText="Please complete the form above before you can update."
                :transactionInflightText="transactionText"
                :ipfsDataHash="ipfsDataHash"
                :ipfsPayload="getIpfsPayload" />
            </vue-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import InfuraIpfsService from "@/services/infura.ipfs.service";

    // @ts-ignore
    import Datepicker from 'vuejs-datepicker';
    import SmallSpinner from "./SmallSpinner";
    import FormFooter from "@/components/FormFooter.vue";
    import moment from "moment";
    import _ from "lodash";
    import {mapState, mapGetters} from "vuex";

    const ipfsService = new InfuraIpfsService();

    export default {
        name: "UpdateToken",
        components: {SmallSpinner, Datepicker, FormFooter},
        data() {
          return {
            tokenId: null,
            searching: false,
            saving: false,
            ipfsData: null,
            ipfsDataRetrieved: false,
            attributes: null,
            ownerOf: '',
            noResultFound: false,
            foundTokenId: '',
            transactionHash: '',
            transactionText: '',
            ipfsDataHash: null,
            model: {
              purchase_location: '',
              purchase_date: '',
              customization_location: '',
              customization_date: '',
              material_1: '',
              material_2: '',
              material_3: '',
              material_4: '',
              material_5: ''
            },
            formState: {}
          }
        },
        computed: {
          ...mapGetters(['canAccountMint', 'accountProperties']),
          ...mapState(['account']),
          isUpdateBtnDisabled() {
            return this.formState.$invalid && !this.account && !this.canAccountMint;
          }
        },
        methods: {
          resetData() {
            this.searching = false;
            this.attributes = {};
            this.ownerOf = '';
            this.noResultFound = false;
            this.ipfsDataRetrieved = false;
            this.transactionHash = '';
            this.ipfsDataHash = null;
            this.model = {
              purchase_location: '',
              purchase_date: '',
              customization_location: '',
              customization_date: '',
              material_1: '',
              material_2: '',
              material_3: '',
              material_4: '',
              material_5: ''
            };
          },
          performTokenSearch() {
            this.resetData();
            this.searching = true;

            const isTokenIdSearch = this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId));
            if (isTokenIdSearch) {
              this.findInformationForTokenId(this.tokenId);
            }
          },
          findInformationForTokenId(tokenId) {
            this.foundTokenId = tokenId;
            this.$store.dispatch('findInformationForTokenId', tokenId)
              .then(({attributes, ownerOf}) => {
                this.attributes = attributes;
                this.ownerOf = ownerOf;
                this.productId = "";
                this.tokenId = "";

                axios.get(attributes._ipfsUrl)
                  .then((response) => {
                    if (response && response.status === 200) {
                      this.ipfsData = response.data;

                      // Pre-populate any existing information
                      const attributes = this.ipfsData.attributes;
                      const {
                        customization_date,
                        purchase_date,
                        ...prepopulatedAttributes
                      } = _.pick(attributes, Object.keys(this.model));

                      let convertedCustomizationDate = customization_date;
                      if (!convertedCustomizationDate) {
                        convertedCustomizationDate = '';
                      } else {
                        convertedCustomizationDate = moment(convertedCustomizationDate, 'YYYY-MM-DD').toDate()
                      }

                      let convertedPurchaseDate = purchase_date;
                      if (!convertedPurchaseDate) {
                        convertedPurchaseDate = '';
                      } else {
                        convertedPurchaseDate = moment(convertedPurchaseDate, 'YYYY-MM-DD').toDate()
                      }

                      this.model = {
                        ...this.model,
                        ...prepopulatedAttributes,
                        customization_date: convertedCustomizationDate,
                        purchase_date: convertedPurchaseDate
                      };

                      this.ipfsDataRetrieved = true;
                      this.searching = false;
                    } else {
                      alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
                    }
                  });
              })
              .catch(() => {
                this.searching = false;
                this.noResultFound = true;
              });
          },
          disabledDates() {
            const today = new Date();
            return {
              from: today
            }
          },
          cleanJsonObject(object) {
            return _(object)
              .omitBy(_.isUndefined)
              .omitBy(_.isNull)
              .omitBy((value) => {
                return value.trim ? value.trim() === '' : false
              })
              .value();
          },
          getIpfsPayload() {
            const newPayload = {...this.ipfsData ? this.ipfsData : {}};
            if (newPayload.attributes) {
              const cleanAttributes = this.cleanJsonObject(newPayload.attributes);
              const cleanModel = this.cleanJsonObject(this.model);

              newPayload.attributes = {
                ...cleanAttributes,
                ...cleanModel
              };

              // Allow removals to apply a deletion rule to the data blob
              const updatableFields = ['purchase_location', 'purchase_date', 'customization_location', 'customization_date', 'material_1', 'material_2', 'material_3', 'material_4', 'material_5'];
              _.forEach(updatableFields, (field) => {
                if (!cleanModel[field] && newPayload.attributes[field]) {
                  delete newPayload.attributes[field];
                }
              });
            }

            if (newPayload.attributes.purchase_date) {
              newPayload.attributes.purchase_date = moment(newPayload.attributes.purchase_date).format('YYYY-MM-DD');
            }

            if (newPayload.attributes.customization_date) {
              newPayload.attributes.customization_date = moment(newPayload.attributes.customization_date).format('YYYY-MM-DD');
            }

            return newPayload;
          },
          async onSubmit() {
            if (this.transactionHash.length > 0) {
              console.log("Already submitted");
              return;
            }

            if (this.formState.$valid) {

              this.transactionHash = '';
              this.transactionText = 'Update being submitted to chain...';
              this.saving = true;

              const ipfsPayload = this.getIpfsPayload();
              this.ipfsDataHash = await ipfsService.pushJsonToIpfs(ipfsPayload);
              if (this.ipfsDataHash === 'unsuccessful') {
                this.saving = false;
                return;
              }

              this.$store.dispatch('updateTokenIPFSHash', {
                tokenId: this.foundTokenId,
                ipfsHash: this.ipfsDataHash,
                onceTxHash: hash => {
                  this.transactionHash = hash;
                },
                onceReceipt: () => {
                  this.transactionText = 'Update successful!';
                  this.saving = false;
                }
              });
            } else {
              console.log(this.formState.$error);
            }
          },
          // eslint-disable-next-line class-methods-use-this
          fieldClassName(field) {
            if (!field) {
              return '';
            }
            if ((field.$touched || field.$submitted) && field.$valid) {
              return 'text-success';
            }
            if ((field.$touched || field.$submitted) && field.$invalid) {
              return 'text-danger';
            }
            return '';
          },
          inputClassName(field) {
            if (!field) {
              return '';
            }
            if ((field.$touched || field.$submitted) && field.$valid) {
              return 'border-success';
            }
            if ((field.$touched || field.$submitted) && field.$invalid) {
              return 'border-danger';
            }
            return '';
          },
        }
    }
</script>

<style scoped>
  .min-height-card {
    min-height: 180px;
  }
</style>
