# ASTA a.k.a. AWS security token utility
A tool to help developers easily work with temporary security tokens between different accounts in AWS.

## Prerequisites
All **master credential profiles** are profiles in the *".aws/credentials"* -file that have the right to change role in one or several AWS accounts. Basically it uses AWS STS to generate a temporary token.

These profiles needs to be defined in *".aws/credentials"* -file. If there are MFA then the serial must be included.

```
[a_master_credential]
aws_access_key_id = <access-key>
aws_secret_access_key = <secret-access-key>
mfa_serial = arn:aws:iam::<account-id>:mfa/<iam-user-name>
```

```
[a_role_in_an_account]
region = eu-west-1
role_arn = arn:aws:iam::<account-id>:role/<role>
source_profile = a_master_credential-temp
output = json
```

The *-temp profile is the temporary token that has been generated.

## Installation
It is preferable to install it globally if there are many projects using it, but otherwise it can be installed within a project. However, note that the configuration is stored in the user home directory, so if there are several instances of it, they will all use the same configuration file.**
```bash
> npm install -g asta
```

## Usage
The command syntax is using the following pattern:
```bash
> asta [options] [commands]
```

### Options
> **--version ( or: -V )**
> *Output the version number*
> ```bash
> > asta --version
>```

> **--verbose ( or: -v )**
> *Add this to any command to see more details *
> ```bash
> > asta --version
>```

> **--help ( or: -h )**
> *Output usage information*
> ```bash
> > asta --version
>```

### Commands
> ***(*** *""* ***)***
> If no arguments are entered  the usage information will displayed (see options -h, --help)*
> ```bash
> > asta
>```

> ***( \<profile\> )***
> *Generate a temporary token for a **specific** given master credential profile*
> ```bash
> > asta <profile>
>```

> **generate ***( or: g )*****
> *Generate temporary token for **all configured** master credential profiles (see **config**)*
> ```bash
> > asta [options] g|generate
>```

> **information ***( or: i )*****
> *Details of current environment and settings*
> ```bash
> > asta [options] i|information
>```

> **config ***( or: c )*****
> *Select default profile and master credentials*
> ```bash
> > asta [options] c|config
>```

> **update ***( or: u )*****
> *The tool will indicate when running if any update is available, if so, this command will update to latest version.*
> ```bash
> > asta [options] u|update
>```
