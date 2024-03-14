CREATE USER 'seri'@'localhost' IDENTIFIED BY 'seri';
GRANT ALL PRIVILEGES ON `healthdiary`.* TO 'seri'@'localhost';
FLUSH PRIVILEGES;
