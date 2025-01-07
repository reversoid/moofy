-- migrate:up

-- Enums
CREATE TYPE public.film_type_enum AS ENUM (
    'FILM',
    'TV_SERIES',
    'TV_SHOW',
    'MINI_SERIES',
    'VIDEO'
);

CREATE TYPE public.task_task_type_enum AS ENUM (
    'AUTH',
    'REVIEW',
    'LIST'
);

-- Functions
CREATE FUNCTION public.to_film_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.name, ''));
            return new;
          end
          $$;

CREATE FUNCTION public.to_list_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(new.description, '')), 'B');
            return new;
          end
          $$;

CREATE FUNCTION public.to_review_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.description, ''));
            return new;
          end
          $$;

CREATE FUNCTION public.to_username_tsvector() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            begin
              new.username_search_document := to_tsvector('simple', coalesce(new.username, ''));
            return new;
          end
          $$;

-- Tables
CREATE TABLE public.comment (
    id integer NOT NULL,
    text character varying(400) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" integer NOT NULL,
    "replyToId" integer,
    "listId" integer
);

CREATE TABLE public.comment_like (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" integer NOT NULL,
    "commentId" integer NOT NULL
);

CREATE TABLE public.favorite_list (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" integer NOT NULL,
    "listId" integer
);

CREATE TABLE public.film (
    id character varying(32) NOT NULL,
    name character varying(128) NOT NULL,
    year smallint NOT NULL,
    type public.film_type_enum NOT NULL,
    "filmLength" character(6),
    "posterPreviewUrl" character varying(120),
    "posterUrl" character varying(120),
    genres character varying(32)[],
    search_document tsvector NOT NULL
);

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
    "userId" integer NOT NULL,
    search_document tsvector NOT NULL
);

CREATE TABLE public.list_like (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" integer NOT NULL,
    "listId" integer NOT NULL
);

CREATE TABLE public.list_view (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" integer NOT NULL,
    "listId" integer NOT NULL
);

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);

CREATE TABLE public.review (
    id integer NOT NULL,
    score smallint,
    description character varying(400),
    tags character varying(32)[],
    order_in_list numeric(20,16) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "filmId" character varying(32) NOT NULL,
    "userId" integer NOT NULL,
    "listId" integer NOT NULL,
    search_document tsvector NOT NULL
);

CREATE TABLE public.subscription (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    follower_id integer,
    followed_id integer
);

CREATE TABLE public.task (
    id integer NOT NULL,
    task_date timestamp with time zone NOT NULL,
    task_type public.task_task_type_enum NOT NULL,
    task_name character varying(32) NOT NULL
);

CREATE TABLE public.to_watch (
    id integer NOT NULL,
    watched boolean DEFAULT false NOT NULL,
    "userId" integer NOT NULL,
    "filmId" character varying(32) NOT NULL
);

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

-- Sequences
CREATE SEQUENCE public.comment_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.comment_like_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.favorite_list_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.list_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.list_like_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.list_view_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.migrations_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.review_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.subscription_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.task_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.to_watch_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE public.user_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Sequence Ownership
ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;
ALTER SEQUENCE public.comment_like_id_seq OWNED BY public.comment_like.id;
ALTER SEQUENCE public.favorite_list_id_seq OWNED BY public.favorite_list.id;
ALTER SEQUENCE public.list_id_seq OWNED BY public.list.id;
ALTER SEQUENCE public.list_like_id_seq OWNED BY public.list_like.id;
ALTER SEQUENCE public.list_view_id_seq OWNED BY public.list_view.id;
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;
ALTER SEQUENCE public.subscription_id_seq OWNED BY public.subscription.id;
ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;
ALTER SEQUENCE public.to_watch_id_seq OWNED BY public.to_watch.id;
ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;

-- Default Values
ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);
ALTER TABLE ONLY public.comment_like ALTER COLUMN id SET DEFAULT nextval('public.comment_like_id_seq'::regclass);
ALTER TABLE ONLY public.favorite_list ALTER COLUMN id SET DEFAULT nextval('public.favorite_list_id_seq'::regclass);
ALTER TABLE ONLY public.list ALTER COLUMN id SET DEFAULT nextval('public.list_id_seq'::regclass);
ALTER TABLE ONLY public.list_like ALTER COLUMN id SET DEFAULT nextval('public.list_like_id_seq'::regclass);
ALTER TABLE ONLY public.list_view ALTER COLUMN id SET DEFAULT nextval('public.list_view_id_seq'::regclass);
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);
ALTER TABLE ONLY public.subscription ALTER COLUMN id SET DEFAULT nextval('public.subscription_id_seq'::regclass);
ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);
ALTER TABLE ONLY public.to_watch ALTER COLUMN id SET DEFAULT nextval('public.to_watch_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

-- Primary Keys and Constraints
ALTER TABLE ONLY public.comment_like ADD CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY (id);
ALTER TABLE ONLY public.list_like ADD CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" PRIMARY KEY (id);
ALTER TABLE ONLY public.comment ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);
ALTER TABLE ONLY public.to_watch ADD CONSTRAINT "PK_0fd820af7972ef612ea0e17ae21" PRIMARY KEY (id);
ALTER TABLE ONLY public.favorite_list ADD CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY (id);
ALTER TABLE ONLY public.review ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);
ALTER TABLE ONLY public.film ADD CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY (id);
ALTER TABLE ONLY public.list_view ADD CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" PRIMARY KEY (id);
ALTER TABLE ONLY public.subscription ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
ALTER TABLE ONLY public.list ADD CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY (id);
ALTER TABLE ONLY public.task ADD CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);
ALTER TABLE ONLY public.users ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);

-- Foreign Keys
ALTER TABLE ONLY public.review ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.favorite_list ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES public.list(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.list_like ADD CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.list_like ADD CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" FOREIGN KEY ("listId") REFERENCES public.list(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.review ADD CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" FOREIGN KEY ("listId") REFERENCES public.list(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.list_view ADD CONSTRAINT "FK_4217d199530fdd010220d8d473a" FOREIGN KEY ("listId") REFERENCES public.list(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.list ADD CONSTRAINT "FK_46ded14b26382088c9f032f8953" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.to_watch ADD CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comment_like ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES public.comment(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.list_view ADD CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comment_like ADD CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.to_watch ADD CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c" FOREIGN KEY ("filmId") REFERENCES public.film(id);
ALTER TABLE ONLY public.comment ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3" FOREIGN KEY ("replyToId") REFERENCES public.comment(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.review ADD CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY ("filmId") REFERENCES public.film(id);
ALTER TABLE ONLY public.favorite_list ADD CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" FOREIGN KEY ("listId") REFERENCES public.list(id);

-- Indexes
CREATE INDEX "IDX_004547e1fee5af6fc9fd3de095" ON public.review USING btree (created_at);
CREATE INDEX "IDX_0d47abc4c0e4671f5bf00af599" ON public.list_like USING btree (deleted_at);
CREATE INDEX "IDX_0e35629d588558a1871982f2d2" ON public.list USING btree (deleted_at);
CREATE INDEX "IDX_15eb3b90a408e3222e1ef34035" ON public.comment_like USING btree (created_at);
CREATE INDEX "IDX_1f7c693bc26ed21008acead3b3" ON public.comment USING btree (deleted_at);
CREATE INDEX "IDX_22b81d3ed19a0bffcb660800f4" ON public.users USING btree (deleted_at);
CREATE INDEX "IDX_2a0b9c4cf6de3f70c174a9a4c9" ON public.to_watch USING btree (watched);
CREATE INDEX "IDX_2e9f9d450d42a53a579dd00c38" ON public.comment_like USING btree (deleted_at);
CREATE UNIQUE INDEX "IDX_33394d9f1edb8dada30dd4c903" ON public.task USING btree (task_name);
CREATE INDEX "IDX_4bec8d4c2bb9e78f4eadc80830" ON public.task USING btree (task_type);
CREATE INDEX "IDX_4d2005680706ade52516a9b24b" ON public.favorite_list USING btree (created_at);
CREATE INDEX "IDX_5a82570b7c5f8d77972f7ef76a" ON public.film USING btree (year);
CREATE INDEX "IDX_5aa49498820d9f4e5afb35254b" ON public.film USING btree (genres);
CREATE INDEX "IDX_5fc50495948dd3c91bfec4276a" ON public.review USING btree (deleted_at);
CREATE INDEX "IDX_70c253d5411a4abf1c752a4699" ON public.film USING btree (name);
CREATE INDEX "IDX_72bcd910d3caf258faded7e777" ON public.list_like USING btree (created_at);
CREATE INDEX "IDX_77b6e8e786643c3e78280800e1" ON public.list USING btree (updated_at);
CREATE INDEX "IDX_80b7c880992ddf646c03674f80" ON public.list USING btree (created_at);
CREATE INDEX "IDX_84eaa1e0d08e574fb78fd3c9b3" ON public.comment USING btree (text);
CREATE INDEX "IDX_8b52b9aae50d89a98d3ef92c8d" ON public.subscription USING btree (deleted_at);
CREATE INDEX "IDX_939fa09e877d128e141e49f716" ON public.task USING btree (task_date);
CREATE INDEX "IDX_9611a099501597c519429f2595" ON public.comment USING btree (created_at);
CREATE INDEX "IDX_9a97c3ebf1bef5345852963e4c" ON public.subscription USING btree (created_at);
CREATE INDEX "IDX_9cdce43fa0043c794281aa0905" ON public.users USING btree (updated_at);
CREATE INDEX "IDX_9e1aabc3453a7c955553f498c6" ON public.to_watch USING btree ("userId");
CREATE INDEX "IDX_b678c932a26ad586d6afd5ee42" ON public.to_watch USING btree ("filmId");
CREATE INDEX "IDX_bcfc7a2063b16b9532c482ea27" ON public.favorite_list USING btree (deleted_at);
CREATE INDEX "IDX_c1b1047b4293e41323a080e220" ON public.film USING btree (type);
CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON public.users USING btree (created_at);
CREATE INDEX "IDX_d7ff6872c82ac4a87ff986a38d" ON public.list USING btree (name);
CREATE INDEX "IDX_e045ebbb33ef7af0d13176f55b" ON public.review USING btree (updated_at);
CREATE INDEX "IDX_ff4c1609981279c3df153fda3c" ON public.film USING btree ("filmLength");
CREATE INDEX search_film_document_idx ON public.film USING gin (search_document);
CREATE INDEX search_list_document_idx ON public.list USING gin (search_document);
CREATE INDEX search_review_document_idx ON public.review USING gin (search_document);
CREATE INDEX username_search_document_idx ON public.users USING gin (username_search_document);

-- Triggers
CREATE TRIGGER film_tsvector_update BEFORE INSERT OR UPDATE ON public.film FOR EACH ROW EXECUTE FUNCTION public.to_film_tsvector();
CREATE TRIGGER list_tsvector_update BEFORE INSERT OR UPDATE ON public.list FOR EACH ROW EXECUTE FUNCTION public.to_list_tsvector();
CREATE TRIGGER review_tsvector_update BEFORE INSERT OR UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.to_review_tsvector();
CREATE TRIGGER username_tsvector_update BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.to_username_tsvector();

-- migrate:down