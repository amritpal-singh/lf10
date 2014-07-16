function OutputViewModel(data)
{
	self = this;

	self.id = new Date().getTime();
	self.name;
	self.by;
	self.data = data;
	self.date = new Date(self.id).toDateString();
}