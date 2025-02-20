-- migrate:up
DROP INDEX IF EXISTS "IDX_004547e1fee5af6fc9fd3de095"; -- reviews.created_at
DROP INDEX IF EXISTS "IDX_4d2005680706ade52516a9b24b"; -- favorite_collections.created_at
DROP INDEX IF EXISTS "IDX_5a82570b7c5f8d77972f7ef76a"; -- films.year
DROP INDEX IF EXISTS "IDX_5aa49498820d9f4e5afb35254b"; -- films.genres
DROP INDEX IF EXISTS "IDX_70c253d5411a4abf1c752a4699"; -- films.name
DROP INDEX IF EXISTS "IDX_72bcd910d3caf258faded7e777"; -- collection_likes.created_at
DROP INDEX IF EXISTS "IDX_77b6e8e786643c3e78280800e1"; -- collections.updated_at
DROP INDEX IF EXISTS "IDX_80b7c880992ddf646c03674f80"; -- collections.created_at
DROP INDEX IF EXISTS "IDX_9a97c3ebf1bef5345852963e4c"; -- subscriptions.created_at
DROP INDEX IF EXISTS "IDX_9cdce43fa0043c794281aa0905"; -- users.updated_at
DROP INDEX IF EXISTS "IDX_c1b1047b4293e41323a080e220"; -- films.type
DROP INDEX IF EXISTS "IDX_d091f1d36f18bbece2a9eabc6e"; -- users.created_at
DROP INDEX IF EXISTS "IDX_d7ff6872c82ac4a87ff986a38d"; -- collections.name
DROP INDEX IF EXISTS "IDX_e045ebbb33ef7af0d13176f55b"; -- reviews.updated_at
DROP INDEX IF EXISTS "IDX_ff4c1609981279c3df153fda3c"; -- films.film_length

-- migrate:down
CREATE INDEX "IDX_004547e1fee5af6fc9fd3de095" ON public.reviews USING btree (created_at);
CREATE INDEX "IDX_4d2005680706ade52516a9b24b" ON public.favorite_collections USING btree (created_at);
CREATE INDEX "IDX_5a82570b7c5f8d77972f7ef76a" ON public.films USING btree (year);
CREATE INDEX "IDX_5aa49498820d9f4e5afb35254b" ON public.films USING btree (genres);
CREATE INDEX "IDX_70c253d5411a4abf1c752a4699" ON public.films USING btree (name);
CREATE INDEX "IDX_72bcd910d3caf258faded7e777" ON public.collection_likes USING btree (created_at);
CREATE INDEX "IDX_77b6e8e786643c3e78280800e1" ON public.collections USING btree (updated_at);
CREATE INDEX "IDX_80b7c880992ddf646c03674f80" ON public.collections USING btree (created_at);
CREATE INDEX "IDX_9a97c3ebf1bef5345852963e4c" ON public.subscriptions USING btree (created_at);
CREATE INDEX "IDX_9cdce43fa0043c794281aa0905" ON public.users USING btree (updated_at);
CREATE INDEX "IDX_c1b1047b4293e41323a080e220" ON public.films USING btree (type);
CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON public.users USING btree (created_at);
CREATE INDEX "IDX_d7ff6872c82ac4a87ff986a38d" ON public.collections USING btree (name);
CREATE INDEX "IDX_e045ebbb33ef7af0d13176f55b" ON public.reviews USING btree (updated_at);
CREATE INDEX "IDX_ff4c1609981279c3df153fda3c" ON public.films USING btree (film_length);

