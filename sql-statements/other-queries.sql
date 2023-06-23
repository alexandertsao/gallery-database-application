-- Aggregation w/ Group By: A user can select a gallery to see how many artworks are in it.
-- Result should be a table grouped by gallery, displaying galleryID, gallery name, and the number of artworks 
SELECT g.gallery_id, g.name, Count(a.art_id)
FROM Art a, Exhibit e, Gallery g
WHERE a.exhibit_id = e.exhibit_id AND e.gallery_id = g.gallery_id AND (e.gallery_id = _user_input__ OR e.gallery_id = _user_input__ … )
GROUP BY e.gallery_id;

-- Aggregation w/ Having: A user can view the number of customers in exhibits with a minimum number of customers set by the user. 
-- Result should be a table grouped by exhibit, displaying exhibitID, exhibit title, and the number of customers 
SELECT v.exhibit_id, title, Count(customer_id)
FROM Visits v, Exhibit e
WHERE v.exhibit_id = e.exhibit_id
GROUP BY v.exhibit_id
HAVING Count(*) > __user_input__ ;

-- Nested Aggregation: Age of Artists with Oldest Artwork:
-- Find the average birth year of artists who have made artworks older than the average age of all artworks in a gallery.
-- Result should display average birth_year -->
CREATE VIEW ArtistsWithOldArt(artist_id, birth_year) AS
SELECT DISTINCT m.artist_id, m.birth_year
FROM Art a, Artist m, Exhibit e, Gallery g
WHERE a.artist_id = m.artist_id AND a.exhibit_id = e.exhibit_id AND 
    e.gallery_id = g.gallery_id AND 
    a.year_created < (SELECT AVG(a2.year_created) 
                        FROM Art a2, Exhibit e2, Gallery g2 
                        WHERE a2.exhibit_id = e2.exhibit_id AND e2.gallery_id = g2.gallery_id AND g2.gallery_id = __user_input__);

SELECT AVG(birth_year)
FROM ArtistsWithOldArt;

-- Division: A user can select a gallery and see which customers have visited every exhibit in that gallery.
-- Result should be a table displaying customerID and customer name -->
SELECT c.customer_id, c.name
FROM Customer c
WHERE NOT EXISTS ((SELECT exhibit_id
			        FROM Exhibit 
                    WHERE gallery_id = ___ )
                    EXCEPT
                  	(SELECT exhibit_id
                    FROM Visits v
		            WHERE v.customer_id = c.customer_id));

