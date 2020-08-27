console.log("This is from index.js");

const yearForm = document.querySelector('#movieForm');
const myInputField = document.querySelector('.input');
const myOutput = document.querySelector('#output');

// makeApiCall function returnes an asynchronos response from the API
// the API call is made to the /movie/popular; Version 3 of themoviedb.org
const makeApiCall = async (pageNum) =>{
    return  response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
            api_key: "7a63b521280157063d27eaefc16e967a",
            language: "en-US",
            page: `${pageNum}`}
    });
};

//processMoviesObj calls makeApicall fucntion and returnes complete data set
// the asynchronous 
// in this example it makes 101 calles to the api and append and returns resuls as array of 101 objects
const processMoviesObj = async() =>{
    let movieResults;
    //let totalResults = [];
    let promises = [];

    const firstResult = await makeApiCall(1);
    const pages = firstResult.data.total_pages;
    
    for (let i=1; i<=pages; i++){
        promises.push(makeApiCall(i));
    }
    movieResults = await Promise.all(promises);
    console.log(movieResults);
    return movieResults;

    // for (let i=1; i<=pages; i++){
    //     movieResults = await makeApiCall(i);
    //     totalResults = totalResults.concat(movieResults); 
    // }
    // console.log(totalResults);
    // return totalResults;
}


//Function doTask listen to submit event and then calles processMoviesObject
//it checks if the year entered exist in the "release_date" of each data set
//if it does, it append the corresponding results property and returnes an array of resutls objects
//if the lenght of the array is more that 10, it reduce it to 10
//finally it travers the results and append each results to the front page using BULMA
const doTask = async() =>
{
    yearForm.addEventListener('submit', async(event) =>{
        event.preventDefault();
        const getEnteredYear = val => val;
        let topMoviesArray = [];
        const movieObjects = await processMoviesObj();

        movieObjects.forEach(responses => {
            const response = responses.data.results;

            const topMovies = response.filter((topMovie) =>{
                if (topMovie.release_date === undefined)
                    return false;
                else
                    return topMovie.release_date.includes(getEnteredYear(myInputField.value));
            });

            topMoviesArray = topMoviesArray.concat(topMovies);

            if (topMoviesArray.length > 10){
                topMoviesArray.length = 10
            }

        });
        console.log(topMoviesArray);

        let showIcon = (icon) => {
            //clear check or remove icons on right sid of input field
            yearForm.querySelector('.icon-remove').style.display = 'none';
            yearForm.querySelector('.icon-check').style.display = 'none';
            //after clearing now display the passed in icon to be displaye; either remove icon on check icon
            yearForm.querySelector(`.icon-${icon}`).style.display = 'inline-flex';
        };

        if (topMoviesArray === undefined || topMoviesArray.length == 0) {

            showIcon('remove');

            let notFoundOutput = '';
            notFoundOutput +=  `
            <article class="message is-danger"> 
                <div class="message-body"> 
                    Movie not found. Please try different year! 
                </div> 
            </article>
            `;
            myOutput.innerHTML = notFoundOutput;
        } 
        else {

            showIcon('check');

            const posterPrefix = 'https://image.tmdb.org/t/p/w94_and_h141_bestv2';
            let movieOutputs = '';
    
            topMoviesArray.forEach(movie => {
                movieOutputs += 
                `
                <article class="media">
                    <figure class="media-left">
                        <p class="image">
                            <img src="${posterPrefix.concat(movie.poster_path)}" />
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <h2>Title: ${movie.original_title}</h2>
                            <h3>Release Year: ${movie.release_date}</h3>
                            <p><b>Summary: </b>${movie.overview}</p>
                        </div>
                    </div>
                </article>
                `;
            });      
            myOutput.innerHTML = movieOutputs;   
            
        };       
    });
};

doTask();