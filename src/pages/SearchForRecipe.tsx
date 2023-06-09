
import {  useContext, useEffect, useRef, useState } from "react"
import Body from "../components/Body"
import { AuthContext } from "../contexts/UserProvider"
import { detailsDrink } from "../components/DisPlayDrinksOnPage"
import { ButtonAdd, ButtonRemove } from "../components/ButtonAddRemove"

interface Drink {
    idDrink: string
    strDrink: string
    strDrinkThumb: string
}

export default function SearchForRecipe() {

    const [IDs, setIDs] = useState<string[]>([])
    const [NowLoading, setNowLoading] = useState<boolean>(false)
    const searchField = useRef<HTMLInputElement>(null)
    const searchFielBbyName = useRef<HTMLInputElement>(null)
    const [isNull, setIsNull] = useState<boolean>(false)
 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        setNowLoading(false)
        e.preventDefault()
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchField.current?.value}`)
        if (response.ok) {
            const data = await response.json()
            data.drink === null ? setIsNull(true) : setIDs((data.drinks.map((drink: Drink) => drink.idDrink)).slice(0, 30)) // api get overloaded if you try to get too m drinks at a time
            console.log(IDs)
            setNowLoading(true)
        }
    }

    async function handleSubmitSearchName(e: React.FormEvent<HTMLFormElement>) {
        setNowLoading(false)
        e.preventDefault()
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchFielBbyName.current?.value}`)
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            data.drink === null? setIsNull(true) : setIDs((data.drinks.map((drink: Drink) => drink.idDrink)).slice(0, 30)) // api get overloaded if you try to get too m drinks at a time
            console.log(IDs)
            setNowLoading(true)
        }
    }    

    return (
        <Body sidebar={true} header={false} footer={true}  >
            <div className="form">
            <form onSubmit={handleSubmit}>
                <input className="form-input" type="text" ref={searchField} placeholder="Enter an ingredient" /> <br />
            </form>
            <br />
            <form onSubmit={handleSubmitSearchName} >
                <input className="form-input" type="text" ref={searchFielBbyName} placeholder=" Enter a drink name" /> <br />
            </form>
            {NowLoading && isNull==false ? <GetDrinksDetailsByID IDs={IDs} heading={''} route="Search Result" /> : <><h4 className="result-h1">Found Nothing</h4></>}
            </div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Body>
    )
}



export function GetDrinksDetailsByID  ({IDs, heading, route}:{IDs:string[], heading:string, route:string}) {

    const base_api_url = import.meta.env.VITE_APP_BASE_API
    const { user } = useContext(AuthContext)
    const token = user.token
    const [resultArray, setResultArray] = useState<detailsDrink[]>([]);
    const [loading, setLoading] = useState(true)
    const result: detailsDrink[] = [];
    const username = user.username
    console.log(username, "username")
    console.log(token, "token")

    useEffect(() => {
        const fetchData = async () => {
            for (let i = 0; i < IDs.length; i++) {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${IDs[i]}`)
                const data = await response.json()
                result.push(data.drinks[0])
            }
            //get unique values from array
            const map = new Map(result.map((item) => [item.idDrink, item]));
            const unique = [...map.values()];
            console.log(unique, "unique ")
            setLoading(false)
            setResultArray(unique)
        }
        fetchData()
    }
        , [])  

    return (
        <div>
            <br />
            <h1 className="result-h1">{heading.toLocaleUpperCase()}</h1>
            {loading ? <div className="result-h1">Loading...</div> : resultArray.map((drink) => (
            <div key={drink.idDrink} className="card">
                <h1>{drink.strDrink}</h1>
                <img src={drink.strDrinkThumb} className="card-img"/>
                <p>{drink.strInstructions}</p>
                <p>{drink.strIngredient1} {drink.strMeasure1} 
                {drink.strIngredient2} {drink.strMeasure2} 
                {drink.strIngredient3} {drink.strMeasure3} 
                {drink.strIngredient4} {drink.strMeasure4}
                {drink.strIngredient5} {drink.strMeasure5}
                {drink.strIngredient6} {drink.strMeasure6}
                {drink.strIngredient7} {drink.strMeasure7}
                {drink.strIngredient8} {drink.strMeasure8}
                {drink.strIngredient9} {drink.strMeasure9}
                {drink.strIngredient10} {drink.strMeasure10}
                {drink.strIngredient11} {drink.strMeasure11}
                {drink.strIngredient12} {drink.strMeasure12}
                {drink.strIngredient13} {drink.strMeasure13}
                {drink.strIngredient14} {drink.strMeasure14}
                {drink.strIngredient15} {drink.strMeasure15}
                </p>    
                <button onClick={async () => {
                    if (route === "UserPage") {
                        await ButtonRemove(drink.idDrink, token, user.username, base_api_url)
                        window.location.reload()
                    }
                    else {
                        await ButtonAdd(drink.idDrink, user.token, user.username, base_api_url)
                    }
                }}>{route === "UserPage" ? "Remove from my list" : "Add to my list"}</button>    
            </div>               
            )
            )}
        </div>
    )
}







 