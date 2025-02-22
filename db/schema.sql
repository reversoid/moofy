SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: film_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.film_type_enum AS ENUM (
    'FILM',
    'TV_SERIES',
    'TV_SHOW',
    'MINI_SERIES',
    'VIDEO'
);


--
-- Name: task_task_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_task_type_enum AS ENUM (
    'AUTH',
    'REVIEW',
    'LIST'
);


--
-- Name: to_film_tsvector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.to_film_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.name, ''));
            return new;
          end
          $$;


--
-- Name: to_list_tsvector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.to_list_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(new.description, '')), 'B');
            return new;
          end
          $$;


--
-- Name: to_review_tsvector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.to_review_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.description, ''));
            return new;
          end
          $$;


--
-- Name: to_username_tsvector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.to_username_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.username_search_document := to_tsvector('simple', coalesce(new.username, ''));
            return new;
          end
          $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: collection_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection_likes (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    collection_id integer NOT NULL
);


--
-- Name: collection_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection_views (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    list_id integer NOT NULL
);


--
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    description character varying(400),
    is_public boolean DEFAULT false NOT NULL,
    image_url character varying(120),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    search_document tsvector NOT NULL
);


--
-- Name: favorite_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_collections (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    collection_id integer
);


--
-- Name: favorite_list_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorite_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorite_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorite_list_id_seq OWNED BY public.favorite_collections.id;


--
-- Name: films; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.films (
    id character varying(32) NOT NULL,
    name character varying(128) NOT NULL,
    year smallint NOT NULL,
    type public.film_type_enum NOT NULL,
    film_length character(6),
    poster_preview_url character varying(120),
    poster_url character varying(120),
    genres character varying(32)[],
    search_document tsvector NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: list_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.list_id_seq OWNED BY public.collections.id;


--
-- Name: list_like_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.list_like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: list_like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.list_like_id_seq OWNED BY public.collection_likes.id;


--
-- Name: list_view_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.list_view_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: list_view_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.list_view_id_seq OWNED BY public.collection_views.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    score smallint,
    description character varying(400),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    film_id character varying(32) NOT NULL,
    user_id integer NOT NULL,
    collection_id integer NOT NULL,
    search_document tsvector NOT NULL
);


--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.reviews.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id integer NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    from_user_id integer,
    to_user_id integer
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    description character varying(400),
    image_url character varying(120),
    password_hash character(60) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username_search_document tsvector NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;


--
-- Name: collection_likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_likes ALTER COLUMN id SET DEFAULT nextval('public.list_like_id_seq'::regclass);


--
-- Name: collection_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_views ALTER COLUMN id SET DEFAULT nextval('public.list_view_id_seq'::regclass);


--
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.list_id_seq'::regclass);


--
-- Name: favorite_collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_collections ALTER COLUMN id SET DEFAULT nextval('public.favorite_list_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscription_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: collection_likes PK_08d899a0a4870c8959ddf52a604; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_likes
    ADD CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" PRIMARY KEY (id);


--
-- Name: favorite_collections PK_298ea5adef17b30abd7df2d3a1d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_collections
    ADD CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY (id);


--
-- Name: reviews PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);


--
-- Name: films PK_37ec0ffe0011ccbe438a65e3c6e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY (id);


--
-- Name: collection_views PK_4d9833b647fd9eacd77ed374854; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_views
    ADD CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" PRIMARY KEY (id);


--
-- Name: subscriptions PK_8c3e00ebd02103caa1174cd5d9d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: collections PK_d8feafd203525d5f9c37b3ed3b9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY (id);


--
-- Name: users UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: search_film_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_film_document_idx ON public.films USING gin (search_document);


--
-- Name: search_list_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_list_document_idx ON public.collections USING gin (search_document);


--
-- Name: search_review_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_review_document_idx ON public.reviews USING gin (search_document);


--
-- Name: username_search_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX username_search_document_idx ON public.users USING gin (username_search_document);


--
-- Name: films film_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER film_tsvector_update BEFORE INSERT OR UPDATE ON public.films FOR EACH ROW EXECUTE FUNCTION public.to_film_tsvector();


--
-- Name: collections list_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER list_tsvector_update BEFORE INSERT OR UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.to_list_tsvector();


--
-- Name: reviews review_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER review_tsvector_update BEFORE INSERT OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.to_review_tsvector();


--
-- Name: users username_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER username_tsvector_update BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.to_username_tsvector();


--
-- Name: reviews FK_1337f93918c70837d3cea105d39; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: collection_likes FK_2f7811183028e0c3b9a66f34957; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_likes
    ADD CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: collections FK_46ded14b26382088c9f032f8953; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT "FK_46ded14b26382088c9f032f8953" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: collection_views FK_a8a0aa213e144f932c9793a6953; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_views
    ADD CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: collection_likes FK_collection_likes_collection_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_likes
    ADD CONSTRAINT "FK_collection_likes_collection_id" FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: collection_views FK_collection_views_collection_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_views
    ADD CONSTRAINT "FK_collection_views_collection_id" FOREIGN KEY (list_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: reviews FK_f1a2e33731808a7c6fcd644ca7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY (film_id) REFERENCES public.films(id);


--
-- Name: favorite_collections FK_favorite_collections_collection_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_collections
    ADD CONSTRAINT "FK_favorite_collections_collection_id" FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: favorite_collections FK_fbbb4b0b4654357a4bd1138ccbd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_collections
    ADD CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews FK_reviews_collection_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_reviews_collection_id" FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250107102114'),
    ('20250107111932'),
    ('20250107113634'),
    ('20250107115051'),
    ('20250107123231');
