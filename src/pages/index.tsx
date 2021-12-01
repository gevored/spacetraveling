import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import {RichText} from 'prismic-dom';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head'
import Primisc from  '@prismicio/client'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

   const constentsPost  = postsResponse.results.map(post=>{
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
      
      const propReturn = {
        next_page : postsResponse.next_page,
        results : constentsPost
      }
  
     // console.log(JSON.stringify(propReturn) , 2)
  return{
    props: {
      propReturn,
      
    }
  }
  // TODO
};
