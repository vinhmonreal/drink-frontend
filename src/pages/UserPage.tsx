
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../contexts/UserProvider"
import { Spinner } from "react-bootstrap"
import Body from "../components/Body"
import { useParams } from "react-router-dom"
import { ButtonAdd, ButtonRemove } from "../components/ButtonAddRemove"
const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function HTMLUserDrinks() {
  const { user } = useContext(AuthContext)
  const [IDs, setIDs] = useState<string[]>([])
  const [headding, setHeadding] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const {username} = useParams()
  const [getid, setGetid] = useState<any>()
  
  useEffect(() => {    
    (async () => { 
      const res = await fetch( `${base_api_url}/user/favdrinks`,{
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          token: user.token
        })
      })
      if(res.ok){
        const data = await res.json()
        console.log(data.id, "where is id")
        setGetid(data.id)
        console.log(getid, "getid")
        setIDs(data.map((drink:any) => drink.idDrink))
        IDs.length > 0 ? setHeadding(`${user.username} has ${IDs.length} fav in list`) : setHeadding(`${user.username} has no Fav Drinks yet!`)
        setLoading(false)
        }
    })()
    IDs.length > 0 ? setHeadding(`${user.username} has ${IDs.length} fav in list`) : setHeadding(`${user.username} has no Fav Drinks yet!`)
  }, [user.token, IDs.length, user.username])

  return (
    <Body sidebar={true} header={false}  footer={false}>
      {loading ? <Spinner animation="grow" /> :  <GetDrinksDetailsByID IDs={IDs}  heading={headding} route="UserPage"/>}
    </Body> 
  )
}


export function GetDrinksDetailsByID  ({IDs, heading, route}:{IDs:string[], heading:string, route:string}) {

    const base_api_url = import.meta.env.VITE_APP_BASE_API
    const { user } = useContext(AuthContext)
    const token = user.token
    const [resultArray, setResultArray] = useState<drinkAndComment[]>([]);
    const [loading, setLoading] = useState(true)
    const result: drinkAndComment[] = [];
    const username = user.username
    const [comment, setComment] = useState<string>("")
    const commentField = useRef<HTMLInputElement>(null)

    useEffect(() => {

        const fetchComment = async () => {
            const response = await fetch(`${base_api_url}/user/favdrinks`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token
                })
            })
            if (response.ok) {
                const userData= await response.json()
                            
                    
        const fetchData = async () => {
            for (let i = 0; i < IDs.length; i++) {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${IDs[i]}`)
                const data = await response.json()
                result.push(data.drinks[0])
                result[i].comment = userData[i].strDrinkThumb
                result[i].id = userData[i].id
            }
            // get unique object from array because react does not like duplicate keys
            const map = new Map(result.map((item) => [item.idDrink, item]));
            const unique = [...map.values()];
            console.log(unique, "unique ")
            setLoading(false)
            setResultArray(unique)
        }
        fetchData()
        }
    }
    fetchComment()
    }, [IDs, token])
 

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
                <h5>My comment: {drink.comment}</h5>
                <form  onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
                    const response = await fetch(`${base_api_url}/user/addcomment/${username}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: token,
                            id: drink.id,
                            comment: comment
                        })
                    })
                    if (response.ok) {
                        window.location.reload()
                    }
                }
                }>
                    <input  placeholder="Comment" type="text" ref={commentField} onChange={(e) => setComment(e.target.value)} /> <br /><br />
                    <button type="submit">Post</button><br /><br />
                    <button type="submit" onClick={async ()=>{
                        const response = await fetch(`${base_api_url}/user/deletecomment/${username}`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token: token,
                                id: drink.id
                            })
                        })
                        if (response.ok) {
                            window.location.reload()
                        }                        
                    }}>Delete</button>
                </form>
            </div>
            ))}
        </div>
    )
}

export interface drinkAndComment {
    id : any;
    comment : any;
    idDrink: any;
    strDrink: any;
    strDrinkThumb: any;
    strInstructions: any;
    strIngredient1: any;
    strMeasure1: any;
    strIngredient2: any;
    strMeasure2: any;
    strIngredient3: any;
    strMeasure3: any;
    strIngredient4: any;
    strMeasure4: any;
    strIngredient5: any;
    strMeasure5: any;
    strIngredient6: any;
    strMeasure6: any;
    strIngredient7: any;
    strMeasure7: any;
    strIngredient8: any;
    strMeasure8: any;
    strIngredient9: any;
    strMeasure9: any;
    strIngredient10: any;
    strMeasure10: any;
    strIngredient11: any;
    strMeasure11: any;
    strIngredient12: any;
    strMeasure12: any;
    strIngredient13: any;
    strMeasure13: any;
    strIngredient14: any;
    strMeasure14: any;
    strIngredient15: any;
    strMeasure15: any;
  }






