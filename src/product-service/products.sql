--
-- PostgreSQL database dump
--

-- Products table data

INSERT INTO public.products (id,title,description,price) VALUES
	 ('14df82d1-df68-4d5b-a2dd-1898dfbdf83f'::uuid,'Course1','Best course',300),
	 ('1bc70301-8d2e-4bd4-bda3-6d05be8b6f4c'::uuid,'Course2','Best course',199),
	 ('213d3795-ef39-4576-b23a-119742c63279'::uuid,'Course3','Best course',400),
	 ('dbb1ebf7-44bf-4965-a27e-df8abff3ab96'::uuid,'Course4','Best course',244),
	 ('a35ccf68-f100-48ef-969a-602c23982bfb'::uuid,'Course5','Best course',444),
	 ('7648abf3-2ade-4fcf-9889-a53aa4ffcb56'::uuid,'Course6','Best course',555),
	 ('3f5ec8e4-d96c-43fb-88d8-db983c431cc0'::uuid,'Course7','Best course',643),
	 ('27a49f5a-fa77-480b-ad6d-15aa1389cd12'::uuid,'Course8','Best course',115);


-- Stocks table data

INSERT INTO public.stocks (product_id,count) VALUES
	 ('14df82d1-df68-4d5b-a2dd-1898dfbdf83f'::uuid,20),
	 ('1bc70301-8d2e-4bd4-bda3-6d05be8b6f4c'::uuid,1),
	 ('213d3795-ef39-4576-b23a-119742c63279'::uuid,5),
	 ('dbb1ebf7-44bf-4965-a27e-df8abff3ab96'::uuid,29),
	 ('a35ccf68-f100-48ef-969a-602c23982bfb'::uuid,19),
	 ('7648abf3-2ade-4fcf-9889-a53aa4ffcb56'::uuid,111),
	 ('3f5ec8e4-d96c-43fb-88d8-db983c431cc0'::uuid,12),
	 ('27a49f5a-fa77-480b-ad6d-15aa1389cd12'::uuid,4);