CREATE TABLE profiles (
    id uuid default uuid_generate_v4(),
    first_name text,
    last_name text,

    primary key (id)
);



CREATE TABLE organizations (
    id uuid default uuid_generate_v4(),
    name text,

    primary key (id)
);

CREATE TABLE projects (
    id uuid default uuid_generate_v4(),
    title text,
    description text,

    primary key (id)
);

