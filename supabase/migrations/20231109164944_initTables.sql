CREATE TABLE profiles (
    id uuid default uuid_generate_v4(),
    first_name text,
    last_name text,
    birth_date date,

    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    primary key (id)
);



CREATE TABLE organizations (
    id uuid default uuid_generate_v4(),
    name text,
    country text,
    logo text,

    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    primary key (id)
);

CREATE TABLE projects (
    id uuid default uuid_generate_v4(),
    title text,
    description text,
    hosted_by uuid,
    partner_orgs uuid[],    

    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    primary key (id),
    foreign key (hosted_by) REFERENCES organizations(id)
);

/* missing this -- Enable MODDATETIME extension
create extension if not exists moddatetime schema extensions;

-- This will set the `updated_at` column on every update
create trigger handle_updated_at before update on YOUR_TABLE_NAME
  for each row execute procedure moddatetime (updated_at);

*/