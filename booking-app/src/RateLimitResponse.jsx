import NewLogo from './NewLogo.jsx';

function RateLimitResponse(){

    return(
      <>
        <div className="rate-limit-div">
          <NewLogo/>
          <h1>429</h1>
          <p>Too Many Requests. Try Again Later.</p>

        </div>
        
      </>



    );

}
export default RateLimitResponse