var Template = function() { return `<?xml version="1.0" encoding="UTF-8" ?>
<document>
  <menuBarTemplate>
    <menuBar>
      <menuItem template="${this.BASEURL}downloads.php" presentation="menuBarItemPresenter">
        <title>Downloads</title>
      </menuItem>
      <menuItem template="${this.BASEURL}wanted.php" presentation="menuBarItemPresenter">
        <title>Wanted</title>
      </menuItem>
      <menuItem template="${this.BASEURL}templates/Search.xml.js" presentation="menuBarItemPresenter">
        <title>Search</title>
      </menuItem>
      <menuItem template="${this.BASEURL}notifications.php" presentation="menuBarItemPresenter">
        <title>Notifications</title>
      </menuItem>
    </menuBar>
  </menuBarTemplate>
</document>`
}