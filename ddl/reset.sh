#!/bin/sh

psql raffles < reset.sql
psql raffles < schema.sql
