import { useState, useEffect } from "react";
import NewsCard from "../elements/NewsCard";

function NewsList () {
    const [newsList, setNewsList] = useState([])
    console.log(newsList)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/summary/get_list_news`)
        .then(res => res.json())
        .then(news => {
            setNewsList(news)
        })
    }, [])

    return (
        <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: 'flex', marginLeft: '24px', marginRight: '24px' }}>
           {
            newsList.map((news) => (
                <NewsCard news={news}/>
            ))
           }
        </div>
    )
}
export default NewsList;