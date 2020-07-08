<template>
  <div class="generator-container txt">
    <h1 class="heading">General Products</h1>
    <hr/>

    <div class="alert alert-wning" v-if="!account || accountProperties.staticWeb3">You must "Login" to mint new tokens</div>
    <div class="alert alert-warning" v-else-if="!canAccountMint">
      It doesn't look like you can mint. Double check you're using the correct account.
    </div>
    <div v-else-if="canAccountMint">
      <vue-form :state="formState" @submit.prevent="onSubmit">

        <validate auto-label class="form-group required-field d-inline-block mr-3">
          <label for="coo">Country of Origin *</label>
          <select name="coo"
                  id="coo"
                  class="form-control"
                  required
                  v-model="model.coo">
            <option value="">Please select one</option>
            <option v-for="code in countryCodes" :value="code['alpha-3']">{{code.name}}</option>
          </select>
        </validate>

        <validate auto-label class="form-group required-field d-inline-block mr-3">
          <label for="initials">Artist Initials *</label>
          <input type="text"
                 name="initials"
                 id="initials"
                 class="form-control text-uppercase"
                 maxlength="4"
                 required v-model="model.initials"/>
        </validate>

        <validate auto-label class="form-group required-field d-inline-block mr-3">
          <label for="series">Series *</label>
          <input type="number"
                 name="series"
                 id="series"
                 min="1"
                 max="999"
                 step="1"
                 class="form-control"
                 required v-model="model.series"/>
        </validate>

        <validate auto-label class="form-group required-field d-inline-block mr-3">
          <label for="design">Design *</label>
          <input type="number"
                 name="design"
                 id="design"
                 min="1"
                 max="9999"
                 step="1"
                 class="form-control"
                 required v-model="model.design"/>
        </validate>

        <validate auto-label class="form-group required-field d-inline-block">
          <label for="tokenId">Token ID *</label>
          <input type="number"
                 min="1"
                 step="1"
                 name="tokenId"
                 id="tokenId"
                 class="form-control"
                 required v-model="model.token_id"/>
        </validate>

        <div v-if="model.token_id && formState.tokenId.$dirty && !isCheckingTokenId ">
          <div class="text-danger" v-if="tokenIdAlreadyAssigned">
            <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
            </font-awesome-icon>
            Token ID already assigned
          </div>
          <div class="text-success" v-if="!tokenIdAlreadyAssigned">
            <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
            </font-awesome-icon>
            Token ID not assigned
          </div>
        </div>

        <h4 class="heading my-3">Unique Identifier:
          <span v-bind:class="{ 'text-success': this.productIdValid, 'text-danger': tokenIdAlreadyAssigned }">
          <span v-bind:class="{ 'text-danger': coo === '{COO}' }">{{coo}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': initials === '{INITIALS}' }">{{initials}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': series === '{SERIES}' }">{{series}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': design === '{DESIGN}' }">{{design}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': tokenId === '{TOKEN_ID}' }">{{tokenId}}</span>
        </span>
        </h4>

        <h4 class="my-3 text-left">Token Information</h4>
        <field class="form-group row">
          <label for="token_name" class="col-sm-3 col-form-label text-right">
            Token Name
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="token_name"
                   id="token_name"
                   class="form-control"
                   value="TokenLandia NFT" disabled/>
          </div>
        </field>

        <field class="form-group row">
          <label for="token_symbol" class="col-sm-3 col-form-label text-right">
            Token Symbol
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="token_symbol"
                   id="token_symbol"
                   class="form-control"
                   value="TLN" disabled/>
          </div>
        </field>


        <h4 class="my-3 text-left">Product Information and Provenance</h4>

        <validate auto-label class="form-group required-field" :class="fieldClassName(formState.name)">
          <div class="row">
            <label for="name" class="col-sm-3 col-form-label text-right">Name *</label>
            <div class="col-sm-9">
              <input type="text"
                     name="name"
                     maxlength="125"
                     id="name"
                     class="form-control"
                     :class="inputClassName(formState.name)"
                     required v-model="model.name"/>

              <field-messages name="name" show="$touched || $submitted" class="form-control-feedback">
                <div slot="required" class="text-danger">Name is a required field</div>
              </field-messages>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-sm-3">&nbsp;</div>
            <div class="col-sm-9 text-muted text-left small">
              <span>({{model.name.length}}/125)</span>
            </div>
          </div>
        </validate>

        <validate auto-label class="form-group required-field"
                  :class="fieldClassName(formState.description)">
          <div class="row">
            <label for="description" class="col-sm-3 col-form-label text-right">Description *</label>
            <div class="col-sm-9">
            <textarea id="description"
                      name="description"
                      class="form-control"
                      :class="inputClassName(formState.description)"
                      maxlength="300"
                      required
                      v-model="model.description">
              </textarea>
              <field-messages
                name="description" show="$touched || $submitted" class="form-control-feedback">
                <div slot="required" class="text-danger">Description is a required field</div>
              </field-messages>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-sm-3">&nbsp;</div>
            <div class="col-sm-9 text-muted text-left small">
              <span>({{model.description.length}}/300)</span>
            </div>
          </div>
        </validate>

        <div class="form-group row required-field">
          <label for="dropzone"
                 class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': file && fileBuffer }">
            Image *
          </label>
          <div class="col-sm-9">
            <vue-dropzone
              ref="myVueDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              :useCustomSlot="true"
              :duplicateCheck="true"
              @vdropzone-file-added="onFileAdded">
              <div class="dropzone-custom-content">
                <h4 class="dropzone-custom-title">Drag and drop the image</h4>
                <div class="subtitle">...or click to select a file from your computer</div>
              </div>
            </vue-dropzone>
          </div>
        </div>

        <validate auto-label class="form-group row required-field"
                  :class="fieldClassName(formState.artist)">
          <label for="artist" class="col-sm-3 col-form-label text-right">Artist</label>
          <div class="col-sm-9">
            <input type="text"
                   name="artist"
                   id="artist"
                   maxlength="125"
                   class="form-control"
                   :class="inputClassName(formState.artist)"
                   v-model="model.artist"/>
          </div>
        </validate>

        <field class="form-group row">
          <label for="artist_assistant" class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': model.artist_assistant }">
            Assistant
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="artist_assistant"
                   id="artist_assistant"
                   maxlength="125"
                   class="form-control"
                   :class="inputClassName(formState.artist_assistant)"
                   v-model.lazy="model.artist_assistant"/>
          </div>
        </field>

        <validate auto-label class="form-group row required-field"
                  :class="fieldClassName(formState.brand)">
          <label for="brand" class="col-sm-3 col-form-label text-right">Brand *</label>
          <div class="col-sm-9">
            <input type="text"
                   name="brand"
                   id="brand"
                   maxlength="125"
                   class="form-control"
                   :class="inputClassName(formState.brand)"
                   required v-model="model.brand"/>
            <field-messages
              name="brand" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Brand is a required field
              </div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field"
                  :class="fieldClassName(formState.model)">
          <label for="model" class="col-sm-3 col-form-label text-right">Model</label>
          <div class="col-sm-9">
            <input type="text"
                   name="model"
                   id="model"
                   maxlength="125"
                   class="form-control"
                   :class="inputClassName(formState.model)"
                   v-model="model.model"/>
          </div>
        </validate>

        <div class="form-group row">
          <label for="purchaseLocation" class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': model.purchase_location }">
            Purchase Location
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="purchaseLocation"
                   maxlength="125"
                   id="purchaseLocation"
                   class="form-control"
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
                        :required="true"
                        format="yyyy-MM-dd"
                        :disabled-dates="disabledDates()"
                        v-model="model.purchase_date">
            </datepicker>
          </div>
        </div>

        <div class="form-group row">
          <label for="customiseLocation" class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': model.customization_location }">
            Customization Location
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="customiseLocation"
                   maxlength="125"
                   id="customiseLocation"
                   class="form-control"
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
                        :required="true"
                        :disabled-dates="disabledDates()"
                        format="yyyy-MM-dd"
                        v-model="model.customization_date">
            </datepicker>
          </div>
        </div>

        <h4 class="heading text-left my-3">Materials Used</h4>

        <div class="form-group row mb-0">
          <label for="material1" class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': model.material_1 }">
            Material 1
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="material2"
                   maxlength="40"
                   id="material1"
                   class="form-control"
                   v-model="model.material_1"/>
          </div>
        </div>
        <div class="row my-1">
          <div class="col-sm-3">&nbsp;</div>
          <div class="col-sm-9 text-muted text-left small">
            <span>({{model.material_1.length}}/40)</span>
          </div>
        </div>

        <div class="form-group row mb-0">
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
        <div class="row my-1">
          <div class="col-sm-3">&nbsp;</div>
          <div class="col-sm-9 text-muted text-left small">
            <span>({{model.material_2.length}}/40)</span>
          </div>
        </div>

        <div class="form-group row mb-0">
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
        <div class="row my-1">
          <div class="col-sm-3">&nbsp;</div>
          <div class="col-sm-9 text-muted text-left small">
            <span>({{model.material_3.length}}/40)</span>
          </div>
        </div>

        <div class="form-group row mb-0">
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
        <div class="row my-1">
          <div class="col-sm-3">&nbsp;</div>
          <div class="col-sm-9 text-muted text-left small">
            <span>({{model.material_4.length}}/40)</span>
          </div>
        </div>

        <div class="form-group row mb-0">
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
        <div class="row my-1">
          <div class="col-sm-3">&nbsp;</div>
          <div class="col-sm-9 text-muted text-left small">
            <span>({{model.material_5.length}}/40)</span>
          </div>
        </div>

        <h4 class="heading text-left my-3">Recipient</h4>

        <validate auto-label class="form-group row required-field" :class="fieldClassNameRecipient(formState.recipient)">
          <label for="recipient" class="col-sm-3 col-form-label text-right">ETH Address *</label>
          <div class="col-sm-9 text-left">

            <b-button-group size="md">
              <b-button
                v-for="(btn, idx) in recipientButtons"
                :key="idx"
                :pressed.sync="btn.state"
                @click="recipientChanged(idx)"
                variant="primary">
                {{ btn.caption }}
              </b-button>
            </b-button-group>
            <input type="text"
                   name="recipient"
                   id="recipient"
                   minlength="42"
                   maxlength="42"
                   v-model="model.recipient"
                   v-bind:class="{
                     'd-none': !recipientButtons[2].state,
                     'd-inline-block form-control mt-2': recipientButtons[2].state,
                     'border-success': formState.recipient && (formState.recipient.$touched || formState.recipient.$submitted) && formState.recipient.$valid,
                     'border-danger': formState.recipient && (formState.recipient.$touched || formState.recipient.$submitted) && formState.recipient.$invalid
                   }"
                   required/>

            <span v-if="model.recipient" class="float-right">
              <span class="text-danger" v-if="!validateAddress(model.recipient)">
                <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
                </font-awesome-icon> Invalid recipient
              </span>
              <span class="text-success" v-if="validateAddress(model.recipient)">
                <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
                </font-awesome-icon> Valid recipient
              </span>
            </span>
          </div>
        </validate>

        <FormFooter
          :saving="saving"
          :transactionHash="mintingTransactionHash"
          :isActionBtnDisabled="isMintingDisabled"
          actionBtnTxt="Mint"
          :formState="formState"
          :generalFormStateInvalid="tokenIdAlreadyAssigned"
          invalidFormStateText="Please complete the form and image upload above before you can mint."
          :transactionInflightText="transactionText"
          :ipfsDataHash="ipfsDataHash"
          :ipfsPayload="getIpfsPayload" />
      </vue-form>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";
    import {Buffer} from 'buffer/';
    import moment from 'moment';
    import _ from 'lodash';

    // @ts-ignore
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    // @ts-ignore
    import Datepicker from 'vuejs-datepicker';

    import SmallSpinner from '@/components/SmallSpinner.vue';
    import TxsLink from "@/components/TxsLink.vue";
    import FormFooter from "@/components/FormFooter.vue";

    import countryCodes from '../../../static/country_codes.json';
    import InfuraIpfsService from "@/services/infura.ipfs.service";

    interface Model {
        coo: string,
        initials: string,
        series: string,
        design: string,
        token_id: string,
        name: string,
        description: string,
        purchase_location: string,
        purchase_date: string,
        customization_location: string,
        customization_date: string,
        brand: string,
        model: string,
        artist: string,
        recipient: string,
        artist_assistant: string,
        material_1: string,
        material_2: string,
        material_3: string,
        material_4: string,
        material_5: string,
    }

    @Component({
        computed: {
            ...mapGetters([
              'isConnected',
              'accountProperties',
              'validateAddress',
              'checksumAddress',
              'canAccountMint',
              'escrowAccountAddress'
            ]),
            ...mapState(['account']),
        },
        components: {
            TxsLink,
            SmallSpinner,
            Datepicker,
            vueDropzone: vue2Dropzone,
            FormFooter
        },
    })
    export default class AssetNFTGenerator extends Vue {
      recipientButtons: any = [
        { caption: 'Escrow Contract', state: true },
        { caption: 'Current Account', state: false },
        { caption: 'Custom', state: false },
      ];

      validateAddress: any;
      escrowAccountAddress: any;

      canAccountMint: any;

      isConnected!: boolean;

        baseIpfsUrl: string = 'https://ipfs.infura.io/ipfs/';

        ipfsService = new InfuraIpfsService();

        formState: any = {};

        model: Model = {
            coo: '',
            initials: '',
            series: '',
            design: '',
            token_id: '',
            name: '',
            description: '',
            purchase_location: '',
            purchase_date: '',
            customization_location: '',
            customization_date: '',
            brand: '',
            model: '',
            artist: '',
            recipient: '',
            artist_assistant: '',
            material_1: '',
            material_2: '',
            material_3: '',
            material_4: '',
            material_5: '',
        };

        dropzoneOptions: any = {
            url: 'https://',
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            autoProcessQueue: false,
            maxFilesize: 5,
            maxFiles: 1,
            minFiles: 1,
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        };

        file: any = null;
        fileBuffer: any = null;

        countryCodes: any = countryCodes;

        account!: string;
        accountProperties: any;

        mintingTransactionHash: string = '';
        ipfsDataHash: string = '';
        saving: boolean = false;
        tokenIdAlreadyAssigned: boolean = false;
        isCheckingTokenId: boolean = false;

        transactionText: string = "";

        recipientChanged(idx: any) {
          if (!this.formState.recipient) {
            this.formState.recipient = {};
          }

          if (idx == 0) {
            this.useEscrowAccount();
            this.formState.recipient.$valid=true;
            this.formState.recipient.$touched=true;
          } else if (idx == 1) {
            this.useCurrentEthAccount();
            this.formState.recipient.$valid=true;
            this.formState.recipient.$touched=true;
          } else if (idx == 2) {
            this.model.recipient = '';
            this.formState.recipient.$valid=false;
            this.formState.recipient.$touched=true;
          }

          this.recipientButtons = this.recipientButtons.map((button: any, mapIdx: number) => {
            return {
              caption: button.caption,
              state: mapIdx == idx
            }
          });
        }

        useCurrentEthAccount() {
            this.model.recipient = this.account ? this.account : '';
        }

        useEscrowAccount() {
          this.model.recipient = this.escrowAccountAddress;
        }

        onFileAdded(file: any) {
            this.file = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                // @ts-ignore
                this.fileBuffer = Buffer.from(reader.result);
            };
            reader.readAsArrayBuffer(file);
        }

        // eslint-disable-next-line class-methods-use-this
        prependPadding(number: string | undefined, maxLength: number): string {
            if (!number) return '';

            let padding: string = '';
            for (let i: number = 0; i < (maxLength - number.length); i += 1) {
                padding += '0';
            }
            return padding + number;
        }

        getIpfsPayload(imageIpfsUrl: string | undefined): any {
           const cleanModel = _(this.model)
             .omitBy(_.isUndefined)
             .omitBy(_.isNull)
             .omitBy((value: any) => {
               return value.trim ? value.trim() === '' : false
             })
             .value();

            const {
                name,
                description,
                series,
                design,
                recipient,
                ...strippedDownModel
            } = cleanModel;

            if (strippedDownModel.purchase_date) {
                strippedDownModel.purchase_date = moment(strippedDownModel.purchase_date).format('YYYY-MM-DD');
            }

            if (strippedDownModel.customization_date) {
                strippedDownModel.customization_date = moment(strippedDownModel.customization_date).format('YYYY-MM-DD');
            }

            return {
                name,
                description,
                image: !imageIpfsUrl ? 'TBC' : imageIpfsUrl,
                type: 'GENERAL_ASSET',
                created: Math.floor( Date.now() / 1000 ),
                attributes: {
                    ...strippedDownModel,
                    product_id: this.productId,
                    series: this.prependPadding(series, 3),
                    design: this.prependPadding(design, 4)
                }
            };
        }

        @Watch('model.token_id')
        async onAccountChange(newVal: any, oldVal: any) {
            this.tokenIdAlreadyAssigned = false;
            this.isCheckingTokenId = true;
            if (newVal !== oldVal) {
                if (newVal) {
                    const checkTokenIdIsValid = await this.$store.dispatch('checkTokenIdIsValid', newVal);
                    this.tokenIdAlreadyAssigned = checkTokenIdIsValid === true;
                }
            }
            this.isCheckingTokenId = false;
        }

        @Watch('model.recipient')
        async onRecipientChange(newVal: any, oldVal: any) {
            if (newVal !== oldVal) {
                if (_.size(newVal) === 42) {
                    // @ts-ignore
                    this.model.recipient = this.checksumAddress(this.model.recipient);
                }
            }
        }

        @Watch('escrowAccountAddress')
        async onEscrowAccountAddressAdded(newVal: any, oldVal: any) {
          if (newVal !== oldVal) {
            this.model.recipient = this.escrowAccountAddress;
          }
        }

        async onSubmit() {
            if (this.mintingTransactionHash.length > 0) {
                console.log("Already submitted");
                return;
            }

            if (!this.file && !this.fileBuffer) {
                alert("An image has not been uploaded");
                return;
            }
            if (this.formState.$valid) {

                this.mintingTransactionHash = '';
                this.transactionText = 'Minting in progress...';
                this.saving = true;

                const imageIpfsHash = await this.ipfsService.uploadImageToIpfs(this.fileBuffer);
                if (imageIpfsHash === 'unsuccessful') {
                    this.saving = false;
                    return;
                }

                const imageIpfsUrl = `${this.baseIpfsUrl}${imageIpfsHash}`;
                const ipfsPayload = this.getIpfsPayload(imageIpfsUrl);
                this.ipfsDataHash = await this.ipfsService.pushJsonToIpfs(ipfsPayload);
                if (this.ipfsDataHash === 'unsuccessful') {
                    this.saving = false;
                    return;
                }

              this.$store.dispatch('mintToken', {
                    selectedToken: 'Tokenlandia',
                    tokenId: this.tokenId,
                    recipient: this.model.recipient,
                    productCode: this.productCode,
                    ipfsHash: this.ipfsDataHash,
                    onceTxHash: (hash: any) => {
                      this.mintingTransactionHash = hash;
                    },
                    onceReceipt: (receipt: any) => {
                      this.transactionText = 'Minting success!';
                      this.saving = false;
                    }
                });
            } else {
                console.log(this.formState.$error);
            }
        }

        // eslint-disable-next-line class-methods-use-this
        fieldClassName(field: any): string {
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
        }

        fieldClassNameRecipient(field: any): string {
            if (!field) {
                return '';
            }
            if ((field.$touched || field.$submitted) && field.$valid && this.validateAddress(this.model.recipient)) {
                return 'text-success';
            }
            if ((field.$touched || field.$submitted) && (field.$invalid || !this.validateAddress(this.model.recipient))) {
                return 'text-danger';
            }
            return '';
        }

        inputClassName(field: any): string {
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
        }

        disabledDates(): any {
            const today = new Date();
            return {
                from: today
            }
        }

        get isMintingDisabled(): boolean {
            return this.formState.$invalid ||
                !this.file && !this.fileBuffer ||
                !this.account ||
                !this.canAccountMint ||
                this.tokenIdAlreadyAssigned ||
                !this.validateAddress(this.model.recipient);
        }

        get productIdValid(): boolean {
            return this.coo !== '{COO}' && this.initials !== '{INITIALS}' && this.series !== '{SERIES}'
                && this.design !== '{DESIGN}' && this.tokenId !== '{TOKEN_ID}' && !this.tokenIdAlreadyAssigned;
        }

        get coo(): string {
            return this.model.coo ? this.model.coo : '{COO}';
        }

        get initials(): string {
            return this.model.initials ? this.model.initials.toUpperCase() : '{INITIALS}';
        }

        get series(): string {
            return this.model.series ? this.prependPadding(this.model.series, 3) : '{SERIES}';
        }

        get design(): string {
            return this.model.design ? this.prependPadding(this.model.design, 4) : '{DESIGN}';
        }

        get tokenId(): string {
            return this.model.token_id ? this.model.token_id : '{TOKEN_ID}';
        }

        get productCode(): string {
            return `${this.coo}-${this.initials}-${this.series}-${this.design}`;
        }

        get productId(): string {
            return `${this.productCode}-${this.tokenId}`;
        }
    }
</script>

<style scoped>
  .generator-container {
  }

  .display-none-important {
    display: none !important;
  }

  @media only screen and (max-width: 1200px) {
    .generator-container {
      width: 90%;
    }
  }

  @media only screen and (max-width: 600px) {
    .generator-container {
      width: 100%;
    }
  }
</style>
