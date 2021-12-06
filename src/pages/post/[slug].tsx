import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router'
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { RichText } from "prismic-dom"
import Head from 'next/head'


interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post } : PostProps) {
  // TODO
  // const router = useRouter()

  const readTimeContent = ()=>{
  
    let countWords = 0 
    for (let indexHeading = 0; indexHeading < post.data.content.length; indexHeading++) {
      
      const element = post.data.content[indexHeading].heading.split(' ').length
      countWords = element + countWords

      for (let indexBody = 0; indexBody < post.data.content[indexHeading].body.length ; indexBody++) {
        const element =   post.data.content[indexHeading].body[indexBody].text.split(' ').length
        countWords = element + countWords
      }
    }

    return(Math.ceil(countWords/200))

  }

  readTimeContent()
  

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <main className = {styles.container}>
        <h1>{post?.data?.title}</h1>
        <div className={styles.info}>
          <time>
            <FaCalendar />
            {post?.first_publication_date}
          </time>
          <span>
            <FaUser />
            {post?.data.author}
          </span>
          <span>
            <FaClock />
            {`${readTimeContent()} min`}
            
          </span>
        </div>
        <div>
          {
            post?.data?.content?.map(content => {
              return (
                <div key={content.heading} className={styles.postContent}>
                  <h1> {content.heading}</h1>
                  <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }} />
                </div>
              )
            })
          }
        </div>
      </main>

    </>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  //const posts = await prismic.query(Predicate);

  // TODO

  return {
    paths: [],
    fallback: "blocking",
  }
};





export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const { slug } = params
  const response: Post = await prismic.getByUID('posts ', String(slug), {});

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'MM/dd/yyyy'),
    data: {
      title: response.data.title,
      banner: String(response.data.banner),
      author: response.data.author,
      content: response.data.content
    }
  }




  console.log('olha só:', post)

  return {
    props: { post }
  }

};
