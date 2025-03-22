import { useParams, useNavigate } from "react-router-dom" 
import { useEffect, useState } from "react"
import styles from './detail.module.css'
import { CoinProps } from "../home"


interface ResponseProps {
    data: CoinProps,
}

interface Error{
    error: string;
}

type DataProps = ResponseProps | Error;

export function Details (){
    const { cript } = useParams();
    const [ coin, setCoin ] = useState<CoinProps>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData(){
            try{
                fetch(`https://api.coincap.io/v2/assets/${cript}`)
                .then((response)=>response.json())
                .then((data: DataProps)=>{
                   
                    if ('error' in data){
                        navigate('/')
                        return
                    }

                    const price = new Intl.NumberFormat("en-US",{style:"currency", currency:"USD"})
                    const priceCompact = new Intl.NumberFormat("en-US",{style:"currency", currency:"USD", notation:"compact"})
                

                    const dataFormated = {
                        ...data.data,
                        priceUsdFormated: price.format(Number(data.data.priceUsd)),
                        marketCapUsdFormated: priceCompact.format(Number(data.data.marketCapUsd)),
                        volumeUsd24HrFormated: priceCompact.format(Number(data.data.volumeUsd24Hr))
                    }

                    setCoin(dataFormated)
                    setLoading(false)
                })
            } catch(err){
                console.log(err)
                navigate('/')
            }
            
        }
        getData()
        } ,[cript])

        if(loading || !coin){
            return(
                <div className={styles.container}>
                    <h4 className={styles.titulo}>Carregando</h4>
                </div>
            )
        }

    return (
        <div className={styles.container}>
            <section className={styles.info}>
                <div>
                    <h3 className={styles.titulo}>{coin?.name}</h3>
                    <h4 className={styles.label}>{coin?.symbol}</h4>
                </div>
                <div>
                    <img 
                        className={styles.logo}
                        alt="logo"
                        src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}2@2x.png`}
                    >
                    </img>
                </div>
            </section>
        
            <hr></hr>

            <section className={styles.content}>
            
                <a>
                    <span className={styles.label}>Classificação: </span> {coin?.rank}<br></br>
                    <span className={styles.label}>VWAP (24h)</span>{Number(coin?.vwap24Hr).toFixed(2)} | <span className={styles.label}>Mudança em 24h</span> <span className={Number(coin?.changePercent24Hr)> 0? styles.tdProfit: styles.tdLoss}>{Number(coin?.changePercent24Hr).toFixed(2)}</span>
                </a>
  
                <a>
                    <span className={styles.label}>Capitalização de Mercado: </span>
                    {coin?.marketCapUsdFormated}
                </a>
                <a>
                    <span className={styles.label}>Preço: </span>
                    {coin?.priceUsdFormated}
                </a>
                <a>
                    <span className={styles.label}>Volume: </span>
                    {coin?.volumeUsd24HrFormated}
                </a>
            
            </section>
        </div>
    )
}