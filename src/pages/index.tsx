import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head'
import Primisc from  '@prismicio/client'
import { format } from 'date-fns';
import Link from 'next/link'
import { FaCalendar , FaStaylinked, FaUser } from 'react-icons/fa';
import { useState , useEffect} from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({postsPagination} : HomeProps) {
   // TODO
  
   const [posts , setPosts] = useState<Post[]>(postsPagination.results)
   const [urlPagination, setUrlPagination] = useState(postsPagination.next_page)

   async function httpFetch(request: RequestInfo) : Promise<any> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  }

   const loadRestPost = async () =>{

    const body : PostPagination =  await  httpFetch(urlPagination)    
    
    setUrlPagination(body.next_page)
    setPosts([...posts, ...body.results])
  }
   
   return (
    <>
     <Head>
        <title>SpaceTraveling | Posts</title>
      </Head>


      <main>
        
        <div className = {styles.posts}>
         {
            posts?.map(post =>{            
              return( 
              <Link key = {post.uid} href = {`/post/${post.uid}`}>
                  <a>
                    <strong key= {post.uid}>{post.data.title}</strong> 
                    <h2>{post.data.subtitle}</h2>
                    <div className={styles.author}>
                      <time>
                        <FaCalendar/>
                        {post.first_publication_date}
                      </time>
                      <p>
                        <FaUser/>
                        {post.data.author}
                      </p>
                      
                    </div>
                  </a>               
                </Link>                               
              )
            })   
          }

          <button
           type="button" className = {urlPagination ? styles.chargePostsEnable:styles.chargePostsDisabled}
           onClick = {loadRestPost}
           >
            <span>
            Carregar mais posts
            </span>
          </button>
        </div>
      </main>
    </>
   )
 }

export const getStaticProps : GetStaticProps = async () => {

   const prismic = getPrismicClient();

   const postsResponse = await prismic.query(
    Primisc.predicates.at('document.type', 'posts'),
    {
      pageSize : 2 
    }
   );

   const constentsPost  =  postsResponse.results.map(post=>{
     return (
       {
         uid:post.uid,
         first_publication_date:format( new Date(post.last_publication_date),'MM/dd/yyyy'),
         data:{
           title: post.data.title,
           subtitle:post.data.subtitle,
           author:post.data.author,
          }
        }
        )
      })
      
      const postsPagination = {
        next_page : postsResponse.next_page,
        results : constentsPost
      }
  
  return{
    props: {
      postsPagination,
    }
  }
  
};
