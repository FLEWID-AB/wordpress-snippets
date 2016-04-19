# Get all tags and save them to a csv in /tmp
This require that the wordpress is installed with wp_ and not any custom table names.

```
  mysql> CONNECT wordpress;
```

```sql
  SELECT wp_terms.`name` AS TagName 
  FROM `wp_terms` 
  INNER JOIN wp_term_taxonomy tax ON tax.term_id = wp_terms.term_id 
  GROUP BY wp_terms.`term_id` 
  INTO OUTFILE '/tmp/tags.csv' 
  FIELDS TERMINATED BY ',' 
  ENCLOSED BY '"' 
  LINES TERMINATED BY '\n';
```