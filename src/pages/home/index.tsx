import { FormEvent, useState, useEffect } from 'react';
import styles from './home.module.css'
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';

export interface CoinProps{
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    priceUsdFormated?:string;
    marketCapUsdFormated?:string;
    volumeUsd24HrFormated?:string;
}

interface DataProps{
    data: CoinProps[];
}

export function Home () {
    const [input, setInput] = useState('')
    const [coin, setCoin] = useState<CoinProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()

    useEffect(()=>{
        getData()
    }
    , [offset])

    async function getData(){
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`).then(
            response => response.json()).then(
                (data: DataProps) => {

                    const price = new Intl.NumberFormat("en-US",{style:"currency", currency:"USD"})
                    const priceCompact = new Intl.NumberFormat("en-US",{style:"currency", currency:"USD", notation:"compact"})
                
                    const formatValues = data.data.map((item) => {
                        const formated = {
                        ...item,
                        priceUsdFormated: price.format(Number(item.priceUsd)),
                        marketCapUsdFormated: priceCompact.format(Number(item.marketCapUsd)),
                        volumeUsd24HrFormated: priceCompact.format(Number(item.volumeUsd24Hr))
                    }
                     return formated   
                    })

                    const newCoins = [...coin, ...formatValues]
                    setCoin(newCoins)
                }
            )
    }

    function handleSubmit(e: FormEvent){
        e.preventDefault()

        if (input === '') return
        navigate(`/detail/${input}`)
    }

    function handleGetMore(){
    
        setOffset(offset + 10)
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                type='text'
                placeholder='Digite o nome da moeda... Ex.: Bitcoin'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />
                <button type='submit'>
                  <BsSearch size='30px' color='white'/>
                </button>
            </form>

            <table className={styles.table}>
                <thead> 
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor de Mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id='tbody'>
                    
                   { coin.length? coin.map((item) => (
                     <tr className={styles.tr} key={item.id}>
                     <td className={styles.tdLabel} data-label='Moeda'>
                         <div className={styles.name}>
                            <img className={styles.coinLogo} alt={`logo${item.name}`} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}2@2x.png`} onError={(e) =>{
                                e.currentTarget.src=`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`
                            }}></img>
                           
                             <Link to={`/detail/${item.id}`}>
                                 <span>{item.name}</span> | {item.symbol}
                             </Link>
                         </div>
                     </td>
                     
                     <td className={styles.tdLabel}  data-label='Valor de Mercado'>
                             {item.marketCapUsdFormated}
                     </td>
                      
                     <td className={styles.tdLabel} data-label='Preço'>
                             {item.priceUsdFormated}
                     </td>
                      
                     <td className={styles.tdLabel} data-label='Volume'>
                             {item.volumeUsd24HrFormated}
                     </td>
                      
                     <td className={Number(item.changePercent24Hr) > 0? styles.tdProfit: styles.tdLoss} data-label='Mudança 24h'>
                             {Number(item.changePercent24Hr).toFixed(2)}
                     </td>
           
                 </tr>
                   )): "Página indisponível"

                   }

                </tbody>
            </table>

            <button className={styles.buttonMore} onClick={handleGetMore}>
                Carregar mais
            </button>
        </main>
    )
}