import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head'
import Primisc from  '@prismicio/client'
import { format } from 'date-fns';
import Link from 'next/link'
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

 export default function Home(props : HomeProps) {
   // TODO
  
   return (
    <>
     <Head>
        <title>SpaceTraveling | Posts</title>
      </Head>

      <main>
        
        <div className = {styles.container}>
         {
            props.postsPagination?.results.map(post =>{            
              return(                
                <p key= {post.uid}>{post.data.author}</p>                
              )
            })
          }
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

   const constentsPost  = await postsResponse.results.map(post=>{
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
