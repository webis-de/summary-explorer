--
-- PostgreSQL database dump
--

-- Dumped from database version 11.9 (Ubuntu 11.9-1.pgdg18.04+1)
-- Dumped by pg_dump version 11.9 (Ubuntu 11.9-1.pgdg18.04+1)

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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: api_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_article (
    id integer NOT NULL,
    article_id integer NOT NULL,
    raw jsonb,
    dataset_id integer NOT NULL
);


ALTER TABLE public.api_article OWNER TO postgres;

--
-- Name: api_article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_article_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_article_id_seq OWNER TO postgres;

--
-- Name: api_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_article_id_seq OWNED BY public.api_article.id;


--
-- Name: api_dataset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_dataset (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.api_dataset OWNER TO postgres;

--
-- Name: api_dataset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_dataset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_dataset_id_seq OWNER TO postgres;

--
-- Name: api_dataset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_dataset_id_seq OWNED BY public.api_dataset.id;


--
-- Name: api_evaluation_criteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_evaluation_criteria (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "order" integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.api_evaluation_criteria OWNER TO postgres;

--
-- Name: api_evaluation_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_evaluation_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_evaluation_criteria_id_seq OWNER TO postgres;

--
-- Name: api_evaluation_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_evaluation_criteria_id_seq OWNED BY public.api_evaluation_criteria.id;


--
-- Name: api_evaluation_criteriums_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_evaluation_criteriums_group (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.api_evaluation_criteriums_group OWNER TO postgres;

--
-- Name: api_evaluation_criteriums_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_evaluation_criteriums_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_evaluation_criteriums_group_id_seq OWNER TO postgres;

--
-- Name: api_evaluation_criteriums_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_evaluation_criteriums_group_id_seq OWNED BY public.api_evaluation_criteriums_group.id;


--
-- Name: api_modeldataset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_modeldataset (
    id integer NOT NULL,
    stats jsonb,
    dataset_id integer NOT NULL,
    smodel_id character varying(100) NOT NULL,
    histogram jsonb
);


ALTER TABLE public.api_modeldataset OWNER TO postgres;

--
-- Name: api_modeldataset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_modeldataset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_modeldataset_id_seq OWNER TO postgres;

--
-- Name: api_modeldataset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_modeldataset_id_seq OWNED BY public.api_modeldataset.id;


--
-- Name: api_smodel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_smodel (
    name character varying(100) NOT NULL,
    title text NOT NULL,
    abstract text NOT NULL,
    human_evaluation text NOT NULL,
    url text NOT NULL,
    raw jsonb,
    stats jsonb
);


ALTER TABLE public.api_smodel OWNER TO postgres;

--
-- Name: api_smodel_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_smodel_group (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    dataset_id integer NOT NULL
);


ALTER TABLE public.api_smodel_group OWNER TO postgres;

--
-- Name: api_smodel_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_smodel_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_smodel_group_id_seq OWNER TO postgres;

--
-- Name: api_smodel_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_smodel_group_id_seq OWNED BY public.api_smodel_group.id;


--
-- Name: api_smodel_group_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_smodel_group_users (
    id integer NOT NULL,
    smodel_group_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_smodel_group_users OWNER TO postgres;

--
-- Name: api_smodel_group_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_smodel_group_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_smodel_group_users_id_seq OWNER TO postgres;

--
-- Name: api_smodel_group_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_smodel_group_users_id_seq OWNED BY public.api_smodel_group_users.id;


--
-- Name: api_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_summary (
    id integer NOT NULL,
    raw jsonb,
    article_id integer NOT NULL,
    smodel_id character varying(100) NOT NULL,
    bert double precision NOT NULL,
    compression double precision NOT NULL,
    factual_consistency double precision NOT NULL,
    length integer NOT NULL,
    novelty double precision NOT NULL,
    rouge1 double precision NOT NULL,
    rouge2 double precision NOT NULL,
    "rougeL" double precision NOT NULL,
    dataset_id integer NOT NULL,
    entity_factuality double precision NOT NULL,
    bi_gram_abs double precision NOT NULL,
    tri_gram_abs double precision NOT NULL,
    uni_gram_abs double precision NOT NULL,
    four_gram_abs double precision NOT NULL
);


ALTER TABLE public.api_summary OWNER TO postgres;

--
-- Name: api_summary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_summary_id_seq OWNER TO postgres;

--
-- Name: api_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_summary_id_seq OWNED BY public.api_summary.id;


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO postgres;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO postgres;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO postgres;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO postgres;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO postgres;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO postgres;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO postgres;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO postgres;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO postgres;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO postgres;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- Name: api_article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_article ALTER COLUMN id SET DEFAULT nextval('public.api_article_id_seq'::regclass);


--
-- Name: api_dataset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_dataset ALTER COLUMN id SET DEFAULT nextval('public.api_dataset_id_seq'::regclass);


--
-- Name: api_evaluation_criteria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_evaluation_criteria ALTER COLUMN id SET DEFAULT nextval('public.api_evaluation_criteria_id_seq'::regclass);


--
-- Name: api_evaluation_criteriums_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_evaluation_criteriums_group ALTER COLUMN id SET DEFAULT nextval('public.api_evaluation_criteriums_group_id_seq'::regclass);


--
-- Name: api_modeldataset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_modeldataset ALTER COLUMN id SET DEFAULT nextval('public.api_modeldataset_id_seq'::regclass);


--
-- Name: api_smodel_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group ALTER COLUMN id SET DEFAULT nextval('public.api_smodel_group_id_seq'::regclass);


--
-- Name: api_smodel_group_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group_users ALTER COLUMN id SET DEFAULT nextval('public.api_smodel_group_users_id_seq'::regclass);


--
-- Name: api_summary id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_summary ALTER COLUMN id SET DEFAULT nextval('public.api_summary_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Data for Name: api_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_article (id, article_id, raw, dataset_id) FROM stdin;
\.


--
-- Data for Name: api_dataset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_dataset (id, name, description) FROM stdin;
\.


--
-- Data for Name: api_evaluation_criteria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_evaluation_criteria (id, title, description, "order", group_id) FROM stdin;
\.


--
-- Data for Name: api_evaluation_criteriums_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_evaluation_criteriums_group (id, title, description) FROM stdin;
\.


--
-- Data for Name: api_modeldataset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_modeldataset (id, stats, dataset_id, smodel_id, histogram) FROM stdin;
\.


--
-- Data for Name: api_smodel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_smodel (name, title, abstract, human_evaluation, url, raw, stats) FROM stdin;
\.


--
-- Data for Name: api_smodel_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_smodel_group (id, name, description, dataset_id) FROM stdin;
\.


--
-- Data for Name: api_smodel_group_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_smodel_group_users (id, smodel_group_id, user_id) FROM stdin;
\.


--
-- Data for Name: api_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_summary (id, raw, article_id, smodel_id, bert, compression, factual_consistency, length, novelty, rouge1, rouge2, "rougeL", dataset_id, entity_factuality, bi_gram_abs, tri_gram_abs, uni_gram_abs, four_gram_abs) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add permission	1	add_permission
2	Can change permission	1	change_permission
3	Can delete permission	1	delete_permission
4	Can view permission	1	view_permission
5	Can add group	2	add_group
6	Can change group	2	change_group
7	Can delete group	2	delete_group
8	Can view group	2	view_group
9	Can add user	3	add_user
10	Can change user	3	change_user
11	Can delete user	3	delete_user
12	Can view user	3	view_user
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add Article	6	add_article
22	Can change Article	6	change_article
23	Can delete Article	6	delete_article
24	Can view Article	6	view_article
25	Can add Summarization Datasets	7	add_dataset
26	Can change Summarization Datasets	7	change_dataset
27	Can delete Summarization Datasets	7	delete_dataset
28	Can view Summarization Datasets	7	view_dataset
29	Can add Evaluation Criteriums Group	8	add_evaluation_criteriums_group
30	Can change Evaluation Criteriums Group	8	change_evaluation_criteriums_group
31	Can delete Evaluation Criteriums Group	8	delete_evaluation_criteriums_group
32	Can view Evaluation Criteriums Group	8	view_evaluation_criteriums_group
33	Can add Summerization Model	9	add_smodel
34	Can change Summerization Model	9	change_smodel
35	Can delete Summerization Model	9	delete_smodel
36	Can view Summerization Model	9	view_smodel
37	Can add Summary	10	add_summary
38	Can change Summary	10	change_summary
39	Can delete Summary	10	delete_summary
40	Can view Summary	10	view_summary
41	Can add Summarization Model Group	11	add_smodel_group
42	Can change Summarization Model Group	11	change_smodel_group
43	Can delete Summarization Model Group	11	delete_smodel_group
44	Can view Summarization Model Group	11	view_smodel_group
45	Can add Evaluation Criteria	12	add_evaluation_criteria
46	Can change Evaluation Criteria	12	change_evaluation_criteria
47	Can delete Evaluation Criteria	12	delete_evaluation_criteria
48	Can view Evaluation Criteria	12	view_evaluation_criteria
49	Can add log entry	13	add_logentry
50	Can change log entry	13	change_logentry
51	Can delete log entry	13	delete_logentry
52	Can view log entry	13	view_logentry
53	Can add model dataset	14	add_modeldataset
54	Can change model dataset	14	change_modeldataset
55	Can delete model dataset	14	delete_modeldataset
56	Can view model dataset	14	view_modeldataset
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	auth	permission
2	auth	group
3	auth	user
4	contenttypes	contenttype
5	sessions	session
6	api	article
7	api	dataset
8	api	evaluation_criteriums_group
9	api	smodel
10	api	summary
11	api	smodel_group
12	api	evaluation_criteria
13	admin	logentry
14	api	modeldataset
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2021-05-24 23:39:57.93175+02
2	auth	0001_initial	2021-05-24 23:39:57.981188+02
3	admin	0001_initial	2021-05-24 23:39:58.060309+02
4	admin	0002_logentry_remove_auto_add	2021-05-24 23:39:58.077072+02
5	admin	0003_logentry_add_action_flag_choices	2021-05-24 23:39:58.086443+02
6	api	0001_initial	2021-05-24 23:39:58.243565+02
7	contenttypes	0002_remove_content_type_name	2021-05-24 23:39:58.313656+02
8	auth	0002_alter_permission_name_max_length	2021-05-24 23:39:58.318114+02
9	auth	0003_alter_user_email_max_length	2021-05-24 23:39:58.325851+02
10	auth	0004_alter_user_username_opts	2021-05-24 23:39:58.33355+02
11	auth	0005_alter_user_last_login_null	2021-05-24 23:39:58.341315+02
12	auth	0006_require_contenttypes_0002	2021-05-24 23:39:58.343544+02
13	auth	0007_alter_validators_add_error_messages	2021-05-24 23:39:58.351076+02
14	auth	0008_alter_user_username_max_length	2021-05-24 23:39:58.364138+02
15	auth	0009_alter_user_last_name_max_length	2021-05-24 23:39:58.37373+02
16	auth	0010_alter_group_name_max_length	2021-05-24 23:39:58.38117+02
17	auth	0011_update_proxy_permissions	2021-05-24 23:39:58.390638+02
18	sessions	0001_initial	2021-05-24 23:39:58.404032+02
19	api	0002_auto_20210531_2049	2021-05-31 22:50:02.275508+02
20	api	0003_summary_dataset	2021-06-03 01:51:27.554912+02
21	api	0004_smodel_stats	2021-06-09 23:21:36.239347+02
22	api	0005_remove_smodel_group	2021-06-14 00:33:21.10289+02
23	api	0006_smodel_dataset	2021-06-14 00:35:04.858134+02
24	api	0007_remove_smodel_dataset	2021-06-14 01:24:57.241425+02
25	api	0008_auto_20210613_2326	2021-06-14 01:26:32.025773+02
26	api	0009_summary_entity_factuality	2021-06-21 02:30:13.433807+02
27	api	0010_auto_20210624_0807	2021-06-24 10:08:10.795583+02
28	api	0011_summary_four_gram_abs	2021-06-24 10:08:10.803227+02
29	api	0012_modeldataset_hisogram	2021-06-28 03:31:57.995214+02
30	api	0013_auto_20210628_0147	2021-06-28 03:47:52.363708+02
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Name: api_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_article_id_seq', 29903, true);


--
-- Name: api_dataset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_dataset_id_seq', 24, true);


--
-- Name: api_evaluation_criteria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_evaluation_criteria_id_seq', 1, false);


--
-- Name: api_evaluation_criteriums_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_evaluation_criteriums_group_id_seq', 1, false);


--
-- Name: api_modeldataset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_modeldataset_id_seq', 104, true);


--
-- Name: api_smodel_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_smodel_group_id_seq', 3, true);


--
-- Name: api_smodel_group_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_smodel_group_users_id_seq', 1, false);


--
-- Name: api_summary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_summary_id_seq', 732302, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 56, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 14, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 30, true);


--
-- Name: api_article api_article_article_id_dataset_id_1ed9d2ee_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_article
    ADD CONSTRAINT api_article_article_id_dataset_id_1ed9d2ee_uniq UNIQUE (article_id, dataset_id);


--
-- Name: api_article api_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_article
    ADD CONSTRAINT api_article_pkey PRIMARY KEY (id);


--
-- Name: api_dataset api_dataset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_dataset
    ADD CONSTRAINT api_dataset_pkey PRIMARY KEY (id);


--
-- Name: api_evaluation_criteria api_evaluation_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_evaluation_criteria
    ADD CONSTRAINT api_evaluation_criteria_pkey PRIMARY KEY (id);


--
-- Name: api_evaluation_criteriums_group api_evaluation_criteriums_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_evaluation_criteriums_group
    ADD CONSTRAINT api_evaluation_criteriums_group_pkey PRIMARY KEY (id);


--
-- Name: api_modeldataset api_modeldataset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_modeldataset
    ADD CONSTRAINT api_modeldataset_pkey PRIMARY KEY (id);


--
-- Name: api_smodel_group api_smodel_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group
    ADD CONSTRAINT api_smodel_group_pkey PRIMARY KEY (id);


--
-- Name: api_smodel_group_users api_smodel_group_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group_users
    ADD CONSTRAINT api_smodel_group_users_pkey PRIMARY KEY (id);


--
-- Name: api_smodel_group_users api_smodel_group_users_smodel_group_id_user_id_21eb83fd_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group_users
    ADD CONSTRAINT api_smodel_group_users_smodel_group_id_user_id_21eb83fd_uniq UNIQUE (smodel_group_id, user_id);


--
-- Name: api_smodel api_smodel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel
    ADD CONSTRAINT api_smodel_pkey PRIMARY KEY (name);


--
-- Name: api_summary api_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_summary
    ADD CONSTRAINT api_summary_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: api_article_dataset_id_e5630b21; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_article_dataset_id_e5630b21 ON public.api_article USING btree (dataset_id);


--
-- Name: api_evaluation_criteria_group_id_453c5fa0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_evaluation_criteria_group_id_453c5fa0 ON public.api_evaluation_criteria USING btree (group_id);


--
-- Name: api_modeldataset_dataset_id_89045890; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_modeldataset_dataset_id_89045890 ON public.api_modeldataset USING btree (dataset_id);


--
-- Name: api_modeldataset_smodel_id_834035b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_modeldataset_smodel_id_834035b0 ON public.api_modeldataset USING btree (smodel_id);


--
-- Name: api_modeldataset_smodel_id_834035b0_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_modeldataset_smodel_id_834035b0_like ON public.api_modeldataset USING btree (smodel_id varchar_pattern_ops);


--
-- Name: api_smodel_group_dataset_id_db3701e1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_smodel_group_dataset_id_db3701e1 ON public.api_smodel_group USING btree (dataset_id);


--
-- Name: api_smodel_group_users_smodel_group_id_825514c5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_smodel_group_users_smodel_group_id_825514c5 ON public.api_smodel_group_users USING btree (smodel_group_id);


--
-- Name: api_smodel_group_users_user_id_2344ae85; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_smodel_group_users_user_id_2344ae85 ON public.api_smodel_group_users USING btree (user_id);


--
-- Name: api_smodel_name_6d0a0a76_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_smodel_name_6d0a0a76_like ON public.api_smodel USING btree (name varchar_pattern_ops);


--
-- Name: api_summary_article_id_bc5ef9ae; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_summary_article_id_bc5ef9ae ON public.api_summary USING btree (article_id);


--
-- Name: api_summary_dataset_id_ab461c21; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_summary_dataset_id_ab461c21 ON public.api_summary USING btree (dataset_id);


--
-- Name: api_summary_smodel_id_eedec493; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_summary_smodel_id_eedec493 ON public.api_summary USING btree (smodel_id);


--
-- Name: api_summary_smodel_id_eedec493_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_summary_smodel_id_eedec493_like ON public.api_summary USING btree (smodel_id varchar_pattern_ops);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: api_article api_article_dataset_id_e5630b21_fk_api_dataset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_article
    ADD CONSTRAINT api_article_dataset_id_e5630b21_fk_api_dataset_id FOREIGN KEY (dataset_id) REFERENCES public.api_dataset(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_evaluation_criteria api_evaluation_crite_group_id_453c5fa0_fk_api_evalu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_evaluation_criteria
    ADD CONSTRAINT api_evaluation_crite_group_id_453c5fa0_fk_api_evalu FOREIGN KEY (group_id) REFERENCES public.api_evaluation_criteriums_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_modeldataset api_modeldataset_dataset_id_89045890_fk_api_dataset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_modeldataset
    ADD CONSTRAINT api_modeldataset_dataset_id_89045890_fk_api_dataset_id FOREIGN KEY (dataset_id) REFERENCES public.api_dataset(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_modeldataset api_modeldataset_smodel_id_834035b0_fk_api_smodel_name; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_modeldataset
    ADD CONSTRAINT api_modeldataset_smodel_id_834035b0_fk_api_smodel_name FOREIGN KEY (smodel_id) REFERENCES public.api_smodel(name) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_smodel_group api_smodel_group_dataset_id_db3701e1_fk_api_dataset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group
    ADD CONSTRAINT api_smodel_group_dataset_id_db3701e1_fk_api_dataset_id FOREIGN KEY (dataset_id) REFERENCES public.api_dataset(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_smodel_group_users api_smodel_group_use_smodel_group_id_825514c5_fk_api_smode; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group_users
    ADD CONSTRAINT api_smodel_group_use_smodel_group_id_825514c5_fk_api_smode FOREIGN KEY (smodel_group_id) REFERENCES public.api_smodel_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_smodel_group_users api_smodel_group_users_user_id_2344ae85_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_smodel_group_users
    ADD CONSTRAINT api_smodel_group_users_user_id_2344ae85_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_summary api_summary_article_id_bc5ef9ae_fk_api_article_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_summary
    ADD CONSTRAINT api_summary_article_id_bc5ef9ae_fk_api_article_id FOREIGN KEY (article_id) REFERENCES public.api_article(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_summary api_summary_dataset_id_ab461c21_fk_api_dataset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_summary
    ADD CONSTRAINT api_summary_dataset_id_ab461c21_fk_api_dataset_id FOREIGN KEY (dataset_id) REFERENCES public.api_dataset(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_summary api_summary_smodel_id_eedec493_fk_api_smodel_name; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_summary
    ADD CONSTRAINT api_summary_smodel_id_eedec493_fk_api_smodel_name FOREIGN KEY (smodel_id) REFERENCES public.api_smodel(name) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

