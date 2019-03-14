drop schema if exists `eventdb` ;
create schema `eventdb`;

use `eventdb`;

drop table if exists `eventdb`.`user`;
drop table if exists `eventdb`.`event`;
drop table if exists `eventdb`.`ticket`;
drop table if exists `eventdb`.`venue`;
drop table if exists `eventdb`.`category`;

create table `eventdb`.`user`(
	`iduser` bigint(20) not null auto_increment ,
	`usertype` varchar(45),
    `firstname` varchar(45),
    `lastname` varchar(45),
    `email` varchar(45),
    `password` varchar(45) not null,
    primary key (`iduser`)
    );
    
create table `eventdb`.`venue` (
	`idvenue` bigint(20) not null auto_increment,
    `name` varchar(100),
    `address` varchar(100),
    `capacity` int,
    primary key(`idvenue`)
	);
    
create table `eventdb`.`category` (
	`idcategory` bigint(20) not null auto_increment,
	`name` varchar(100),
    `description` varchar(1000),
    primary key(`idcategory`)
    );    
    
create table `eventdb`.`event` (
	`idevent` bigint(20) not null auto_increment, 
    `name` varchar (100),
    `description` varchar(2000),
    `idvenue` bigint(20),
    `idcategory` bigint(20),
    primary key (`idevent`),
    foreign key (`idcategory`) references category(`idcategory`),
    foreign key (`idvenue`) references venue(`idvenue`)
    );

create table `eventdb`.`ticket` (
	`idticket` bigint(20) not null auto_increment,
    `type` varchar(100),
    `price` int,
    `idevent` bigint(20),
    `iduser` bigint(20),
    primary key (`idticket`),
    foreign key (`idevent`) references event(`idevent`),
    foreign key (`iduser`) references user(`iduser`)
    );
    

    


    