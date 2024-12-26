import { LightningElement, track, wire } from 'lwc';
import theaternames from '@salesforce/apex/Getinfo.getTheaters';
import Moviename from '@salesforce/apex/Getinfo.getMovies';
import PatronName from '@salesforce/apex/Getinfo.getPatron';
import MovieSHowing from '@salesforce/apex/Getinfo.getMovieshowing';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createTransactions from '@salesforce/apex/Transactioncontroller.createTransaction';
export default class TicketBookings extends LightningElement {
    @track Theatersnames = [];
    @track Moviesnames = [];
    @track PatronNames = [];
    @track MovieShowings = [];
    @track theater=[];
    @track movie=[];
    movieAvalibale=false;
    tickekBooked;
    selectedTheater;
    selectedMovie;
    selectedpatron;
    selectedmovieshowing;
    NoofTickets=2;
    email;
    phoneNo;

    @track details = {
        showtime: this.selectedmovieshowing,
        patron: this.selectedpatron,
        nooftickets: this.NoofTickets,
        email: this.email,
        tel: this.phoneNo,
    };

    // Fetch theater names
    @wire(theaternames)
    wiredTheaterNames({ data, error }) {
        if (data) {
            console.log(data);
            this.Theatersnames = data.map(value => ({
                label: value.Name,
                value: value.Name,
            }));
            this.theater=data.map(value=>value.Name)
            console.log(this.theater)
            console.log('hi')
        } else if (error) {
            console.error(error);
        }
    }

    // Fetch movie names
    @wire(Moviename)
    wiredMovieNames({ data, error }) {
        if (data) {
            console.log(data);
            this.Moviesnames = data.map(value => ({
                label: value.Name,
                value: value.Name,
            }));
        } else if (error) {
            console.error(error);
        }
    }

    // Fetch movie showing details
    /*@wire(MovieSHowing)
    wiredMovieShowings({ data, error }) {
        if (data) {
            console.log(data);
            this.MovieShowings = data.map(value => ({
                label: value.Name,
                value: value.Name,
            }));
        } else if (error) {
            console.error(error);
        }
    }*/

    // Fetch patron names
    @wire(PatronName)
    wiredPatronNames({ data, error }) {
        if (data) {
            console.log(data);
            this.PatronNames = data.map(value => ({
                label: value.Name,
                value: value.Name,
            }));
        } else if (error) {
            console.error(error);
        }
    }

    // Handle combobox changes
    handlechange(event) {
        const field = event.target.name;
        const value = event.detail.value;

        if (field === 'progressTheater') {
            this.selectedTheater = value;
            console.log(`Theater selected: ${this.selectedTheater}`);
        } else if (field === 'progressMovie') {
            this.selectedMovie = value;
            console.log(`Movie selected: ${this.selectedMovie}`);
        } else if (field === 'progressMovieshowing') {
            this.selectedmovieshowing = value;
            console.log(`Movie showing selected: ${this.selectedmovieshowing}`);
        } else if (field === 'progressPatron') {
            this.selectedpatron = value;
            console.log(`Patron selected: ${this.selectedpatron}`);
        }
        if(this.selectedTheater && this.selectedMovie){
            this.fetchmovieShowing();
        }
    }

    //dyanmic movieshowing
    fetchmovieShowing(){
        if(this.selectedTheater && this.selectedMovie){
            MovieSHowing({theaterName:this.selectedTheater,movieName:this.selectedMovie})
            .then(data => {
                console.log(data);
                if(data.length==0){
                    console.log(data.length);
                    this.movieAvalibale=false;
                }
                else{
                this.movieAvalibale=true;}
                this.MovieShowings = data.map(value => ({
                    label: value.Name,
                    value: value.Name,
                }));
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
    // Placeholder for confirm button logic
    handleConfrim() {
        console.log('Confirm button clicked');
        if(this.selectedmovieshowing && this.NoofTickets && this.email && this.phoneNo){
        createTransactions({
            showtime: this.selectedmovieshowing,
            patron: this.selectedpatron,
            nooftickets: this.NoofTickets,
            email: this.email,
            tel: this.phoneNo
        })
        .then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Transaction created successfully',
                    variant: 'success',
                })
            );
            this.tickekBooked=true;
        })
        .catch(error => {
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                })
            );
        });}
    else{
        this.dispatchEvent(new ShowToastEvent({
            title:'Error',
            message:'please Enter all the field',
            variant:'error'
        }))
    }
    }

    // Placeholder for submit button logic
    handleSubmit() {
        console.log('Submit button clicked');

    }
    handlevalues(event){
        const field = event.target.name;
        const value = event.detail.value;
        if(field=="tickets"){
            console.log(`No of ticktes ${this.NoofTickets}`)
            this.NoofTickets=value;
        }
        else if(field=="email"){
            this.email=value;
            console.log(`email is ${this.email}`)
        }
        else if(field=="tel"){
            this.phoneNo=value;
            console.log(` phone no is ${this.phoneNo}`)
        }
    }
    handleFinish(event){
    this.selectedTheater=null;
    this.selectedMovie=null;
    this.selectedpatron=null;
    this.selectedmovieshowing=null;
    this.NoofTickets=2;
    this.email=null;
    this.phoneNo=null;
    if(this.tickekBooked){
        this.dispatchEvent(new ShowToastEvent({
            title:"success",
            message:"Thank You For Booking",
            variant:"Success"
        }))
        this.tickekBooked=false;
    }
    
    }
}
