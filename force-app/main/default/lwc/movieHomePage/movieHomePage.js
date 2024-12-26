import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
export default class MovieHomePage extends NavigationMixin(LightningElement){
    handlebook(){
        this[NavigationMixin.Navigate]({
        type:'standard__objectPage',
        attributes:{
            objectApiName:''
        }
    })};
}