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
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    text character varying(400) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    reply_to_id integer,
    list_id integer
);


--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: comment_like; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_like (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    comment_id integer NOT NULL
);


--
-- Name: comment_like_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comment_like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comment_like_id_seq OWNED BY public.comment_like.id;


--
-- Name: favorite_list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_list (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    list_id integer
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

ALTER SEQUENCE public.favorite_list_id_seq OWNED BY public.favorite_list.id;


--
-- Name: film; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.film (
    id character varying(32) NOT NULL,
    name character varying(128) NOT NULL,
    year smallint NOT NULL,
    type public.film_type_enum NOT NULL,
    film_length character(6),
    poster_preview_url character varying(120),
    poster_url character varying(120),
    genres character varying(32)[],
    search_document tsvector NOT NULL
);


--
-- Name: list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.list (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    description character varying(400),
    is_public boolean DEFAULT false NOT NULL,
    show_rating boolean DEFAULT false NOT NULL,
    show_description boolean DEFAULT true NOT NULL,
    image_url character varying(120),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    search_document tsvector NOT NULL
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

ALTER SEQUENCE public.list_id_seq OWNED BY public.list.id;


--
-- Name: list_like; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.list_like (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    list_id integer NOT NULL
);


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

ALTER SEQUENCE public.list_like_id_seq OWNED BY public.list_like.id;


--
-- Name: list_view; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.list_view (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer NOT NULL,
    list_id integer NOT NULL
);


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

ALTER SEQUENCE public.list_view_id_seq OWNED BY public.list_view.id;


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
-- Name: review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review (
    id integer NOT NULL,
    score smallint,
    description character varying(400),
    tags character varying(32)[],
    order_in_list numeric(20,16) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    film_id character varying(32) NOT NULL,
    user_id integer NOT NULL,
    list_id integer NOT NULL,
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

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    follower_id integer,
    followed_id integer
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

ALTER SEQUENCE public.subscription_id_seq OWNED BY public.subscription.id;


--
-- Name: task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task (
    id integer NOT NULL,
    task_date timestamp with time zone NOT NULL,
    task_type public.task_task_type_enum NOT NULL,
    task_name character varying(32) NOT NULL
);


--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: to_watch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.to_watch (
    id integer NOT NULL,
    watched boolean DEFAULT false NOT NULL,
    user_id integer NOT NULL,
    film_id character varying(32) NOT NULL
);


--
-- Name: to_watch_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.to_watch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: to_watch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.to_watch_id_seq OWNED BY public.to_watch.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    email character varying(256),
    description character varying(400),
    image_url character varying(120),
    password_hash character(60) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
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
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: comment_like id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_like ALTER COLUMN id SET DEFAULT nextval('public.comment_like_id_seq'::regclass);


--
-- Name: favorite_list id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list ALTER COLUMN id SET DEFAULT nextval('public.favorite_list_id_seq'::regclass);


--
-- Name: list id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list ALTER COLUMN id SET DEFAULT nextval('public.list_id_seq'::regclass);


--
-- Name: list_like id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_like ALTER COLUMN id SET DEFAULT nextval('public.list_like_id_seq'::regclass);


--
-- Name: list_view id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_view ALTER COLUMN id SET DEFAULT nextval('public.list_view_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: review id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- Name: subscription id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription ALTER COLUMN id SET DEFAULT nextval('public.subscription_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: to_watch id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_watch ALTER COLUMN id SET DEFAULT nextval('public.to_watch_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: comment_like PK_04f93e6f1ace5dbc1d8c562ccbf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_like
    ADD CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY (id);


--
-- Name: list_like PK_08d899a0a4870c8959ddf52a604; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_like
    ADD CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" PRIMARY KEY (id);


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- Name: to_watch PK_0fd820af7972ef612ea0e17ae21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_watch
    ADD CONSTRAINT "PK_0fd820af7972ef612ea0e17ae21" PRIMARY KEY (id);


--
-- Name: favorite_list PK_298ea5adef17b30abd7df2d3a1d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list
    ADD CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY (id);


--
-- Name: review PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);


--
-- Name: film PK_37ec0ffe0011ccbe438a65e3c6e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.film
    ADD CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY (id);


--
-- Name: list_view PK_4d9833b647fd9eacd77ed374854; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_view
    ADD CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" PRIMARY KEY (id);


--
-- Name: subscription PK_8c3e00ebd02103caa1174cd5d9d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription
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
-- Name: list PK_d8feafd203525d5f9c37b3ed3b9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list
    ADD CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY (id);


--
-- Name: task PK_fb213f79ee45060ba925ecd576e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id);


--
-- Name: users UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: users UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: IDX_004547e1fee5af6fc9fd3de095; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_004547e1fee5af6fc9fd3de095" ON public.review USING btree (created_at);


--
-- Name: IDX_0d47abc4c0e4671f5bf00af599; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_0d47abc4c0e4671f5bf00af599" ON public.list_like USING btree (deleted_at);


--
-- Name: IDX_0e35629d588558a1871982f2d2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_0e35629d588558a1871982f2d2" ON public.list USING btree (deleted_at);


--
-- Name: IDX_15eb3b90a408e3222e1ef34035; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_15eb3b90a408e3222e1ef34035" ON public.comment_like USING btree (created_at);


--
-- Name: IDX_1f7c693bc26ed21008acead3b3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_1f7c693bc26ed21008acead3b3" ON public.comment USING btree (deleted_at);


--
-- Name: IDX_22b81d3ed19a0bffcb660800f4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_22b81d3ed19a0bffcb660800f4" ON public.users USING btree (deleted_at);


--
-- Name: IDX_2a0b9c4cf6de3f70c174a9a4c9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_2a0b9c4cf6de3f70c174a9a4c9" ON public.to_watch USING btree (watched);


--
-- Name: IDX_2e9f9d450d42a53a579dd00c38; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_2e9f9d450d42a53a579dd00c38" ON public.comment_like USING btree (deleted_at);


--
-- Name: IDX_33394d9f1edb8dada30dd4c903; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_33394d9f1edb8dada30dd4c903" ON public.task USING btree (task_name);


--
-- Name: IDX_4bec8d4c2bb9e78f4eadc80830; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_4bec8d4c2bb9e78f4eadc80830" ON public.task USING btree (task_type);


--
-- Name: IDX_4d2005680706ade52516a9b24b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_4d2005680706ade52516a9b24b" ON public.favorite_list USING btree (created_at);


--
-- Name: IDX_5a82570b7c5f8d77972f7ef76a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_5a82570b7c5f8d77972f7ef76a" ON public.film USING btree (year);


--
-- Name: IDX_5aa49498820d9f4e5afb35254b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_5aa49498820d9f4e5afb35254b" ON public.film USING btree (genres);


--
-- Name: IDX_5fc50495948dd3c91bfec4276a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_5fc50495948dd3c91bfec4276a" ON public.review USING btree (deleted_at);


--
-- Name: IDX_70c253d5411a4abf1c752a4699; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_70c253d5411a4abf1c752a4699" ON public.film USING btree (name);


--
-- Name: IDX_72bcd910d3caf258faded7e777; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_72bcd910d3caf258faded7e777" ON public.list_like USING btree (created_at);


--
-- Name: IDX_77b6e8e786643c3e78280800e1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_77b6e8e786643c3e78280800e1" ON public.list USING btree (updated_at);


--
-- Name: IDX_80b7c880992ddf646c03674f80; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_80b7c880992ddf646c03674f80" ON public.list USING btree (created_at);


--
-- Name: IDX_84eaa1e0d08e574fb78fd3c9b3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_84eaa1e0d08e574fb78fd3c9b3" ON public.comment USING btree (text);


--
-- Name: IDX_8b52b9aae50d89a98d3ef92c8d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_8b52b9aae50d89a98d3ef92c8d" ON public.subscription USING btree (deleted_at);


--
-- Name: IDX_939fa09e877d128e141e49f716; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_939fa09e877d128e141e49f716" ON public.task USING btree (task_date);


--
-- Name: IDX_9611a099501597c519429f2595; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9611a099501597c519429f2595" ON public.comment USING btree (created_at);


--
-- Name: IDX_9a97c3ebf1bef5345852963e4c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9a97c3ebf1bef5345852963e4c" ON public.subscription USING btree (created_at);


--
-- Name: IDX_9cdce43fa0043c794281aa0905; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9cdce43fa0043c794281aa0905" ON public.users USING btree (updated_at);


--
-- Name: IDX_9e1aabc3453a7c955553f498c6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9e1aabc3453a7c955553f498c6" ON public.to_watch USING btree (user_id);


--
-- Name: IDX_b678c932a26ad586d6afd5ee42; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_b678c932a26ad586d6afd5ee42" ON public.to_watch USING btree (film_id);


--
-- Name: IDX_bcfc7a2063b16b9532c482ea27; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_bcfc7a2063b16b9532c482ea27" ON public.favorite_list USING btree (deleted_at);


--
-- Name: IDX_c1b1047b4293e41323a080e220; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_c1b1047b4293e41323a080e220" ON public.film USING btree (type);


--
-- Name: IDX_d091f1d36f18bbece2a9eabc6e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON public.users USING btree (created_at);


--
-- Name: IDX_d7ff6872c82ac4a87ff986a38d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d7ff6872c82ac4a87ff986a38d" ON public.list USING btree (name);


--
-- Name: IDX_e045ebbb33ef7af0d13176f55b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_e045ebbb33ef7af0d13176f55b" ON public.review USING btree (updated_at);


--
-- Name: IDX_ff4c1609981279c3df153fda3c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_ff4c1609981279c3df153fda3c" ON public.film USING btree (film_length);


--
-- Name: search_film_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_film_document_idx ON public.film USING gin (search_document);


--
-- Name: search_list_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_list_document_idx ON public.list USING gin (search_document);


--
-- Name: search_review_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_review_document_idx ON public.review USING gin (search_document);


--
-- Name: username_search_document_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX username_search_document_idx ON public.users USING gin (username_search_document);


--
-- Name: film film_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER film_tsvector_update BEFORE INSERT OR UPDATE ON public.film FOR EACH ROW EXECUTE FUNCTION public.to_film_tsvector();


--
-- Name: list list_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER list_tsvector_update BEFORE INSERT OR UPDATE ON public.list FOR EACH ROW EXECUTE FUNCTION public.to_list_tsvector();


--
-- Name: review review_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER review_tsvector_update BEFORE INSERT OR UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.to_review_tsvector();


--
-- Name: users username_tsvector_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER username_tsvector_update BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.to_username_tsvector();


--
-- Name: review FK_1337f93918c70837d3cea105d39; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorite_list FK_21938075574309780e33688b0a5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list
    ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY (list_id) REFERENCES public.list(id) ON DELETE CASCADE;


--
-- Name: list_like FK_2f7811183028e0c3b9a66f34957; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_like
    ADD CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: list_like FK_36bbfd04f2ebcc31a9c42450c36; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_like
    ADD CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" FOREIGN KEY (list_id) REFERENCES public.list(id) ON DELETE CASCADE;


--
-- Name: review FK_37e516b0d42e6a177cbbb15da8c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" FOREIGN KEY (list_id) REFERENCES public.list(id) ON DELETE CASCADE;


--
-- Name: list_view FK_4217d199530fdd010220d8d473a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_view
    ADD CONSTRAINT "FK_4217d199530fdd010220d8d473a" FOREIGN KEY (list_id) REFERENCES public.list(id) ON DELETE CASCADE;


--
-- Name: list FK_46ded14b26382088c9f032f8953; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list
    ADD CONSTRAINT "FK_46ded14b26382088c9f032f8953" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: to_watch FK_9e1aabc3453a7c955553f498c6e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_watch
    ADD CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comment_like FK_a253dba95eab8659c027bbace44; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_like
    ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY (comment_id) REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- Name: list_view FK_a8a0aa213e144f932c9793a6953; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_view
    ADD CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comment_like FK_b5a2fc7a9a2b6bcc8c74f6fbb8b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_like
    ADD CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: to_watch FK_b678c932a26ad586d6afd5ee42c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_watch
    ADD CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c" FOREIGN KEY (film_id) REFERENCES public.film(id);


--
-- Name: comment FK_c0354a9a009d3bb45a08655ce3b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comment FK_cfc14dc2cafa339954de748ebf3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3" FOREIGN KEY (reply_to_id) REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- Name: review FK_f1a2e33731808a7c6fcd644ca7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY (film_id) REFERENCES public.film(id);


--
-- Name: favorite_list FK_fbbb4b0b4654357a4bd1138ccbd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list
    ADD CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comment FK_fc8455c31a9e1a7cfeb0ead49a9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" FOREIGN KEY (list_id) REFERENCES public.list(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250107102114'),
    ('20250107111932');
