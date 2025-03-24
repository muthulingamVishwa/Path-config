import { api, LightningElement,wire } from 'lwc';
import getPath_values from '@salesforce/apex/PathConfingController.getPath_values';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getcurrentpicklistvalues from '@salesforce/apex/PathConfingController.getcurrentpicklistvalues';
export default class PathConfing extends LightningElement {


    @api objectApiName;
    @api recordId;
    wirePathData;
    picklistValues;
    currentPicklistValues;
    getpicklistValues;
    buttonlabel='Mark as Completed';
    showButton =true;
 
    @wire(getPath_values,{objectApiName : '$objectApiName'})
        wiredPathValues(result){
            this.wirePathData = result;
            if(result.data){
                this.fieldApiName= result.data.field__c;
                this.picklistValues = result.data.values__c.split(',');
            }else if(result.error){
                console.log('error',result.error);
            }
        }

    @wire(getcurrentpicklistvalues,{fieldName : '$fieldApiName',objectApiName : '$objectApiName',recordId :'$recordId'})
        wiredRecord(result){ 
            this.getpicklistValues = result;
            if(result.data){
                this.currentPicklistValues = result.data;
                this.showButton = this.currentPicklistValues !== this.picklistValues[this.picklistValues.length-1];

            }else if(result.error){
                console.log('error',result.error);
            }
        }
   

        handleNext(event)
        {
            if(event.target.label === 'Mark as Completed'){
                let index =this.picklistValues.indexOf(this.currentPicklistValues);
                if(index < this.picklistValues.length-1){
                         
                         let updateditem = {
                            fields: {
                                Id: this.recordId,
                                [this.fieldApiName]:this.picklistValues[index+1]
                            }
                        };
                        this.updateRecords(updateditem);
                }
            }else {
            let updateditem = {
            fields: {
                Id: this.recordId,
                [this.fieldApiName]: this.currentPicklistValues
            }
        };
        this.updateRecords(updateditem);
 
        }
}
            
        handleclick(event){ 
            if(this.getpicklistValues.data == event.target.value){
                
            this.buttonlabel = 'Mark as Completed';
          }else{
            this.showButton = true;  
            this.currentPicklistValues = event.target.value;
            this.buttonlabel = 'Mark Current Step';
          }
        }  
        
        updateRecords(updateditem){
            updateRecord(updateditem)
            .then(()=>{
                this.ShowToast('Success','update successfully','success','dismissable');
                this.buttonlabel = 'Mark as Completed';
                this.showButton = this.currentPicklistValues !== this.picklistValues[this.picklistValues.length-1];
                return this.refresh();
            })
            .catch(error=>{
                this.ShowToast( 'Error updating records', error.body ? error.body.message : error.message,'error','dismissable');
            })

        }
        async refresh() {
            await refreshApex(this.getpicklistValues);
        }

        ShowToast(title,message,variant,mode){
            const evt = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
        }
}