import {Navigate} from 'react-router-dom'
function Auth({children}){
    localStorage.setItem("Nin","token123");
    function checkAuth(){
        if(localStorage.getItem("Nin")){
            console.log("correct");
            return "Approved";
        }
        console.log("Some error");
        return null;
    }
    return checkAuth()? children:<Navigate to="/"/>
}
export default Auth ;