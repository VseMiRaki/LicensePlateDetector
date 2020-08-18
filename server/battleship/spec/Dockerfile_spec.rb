# spec/Dockerfile_spec.rb

require "serverspec"
require "docker"
require_relative "spec_helper"
require "rspec/wait"

describe "image specs" do
  before(:all) do
    image = Docker::Image.build_from_dir('.')

    set :os, family: :alpine
    set :backend, :docker
    set :docker_image, image.id
  end

	it "java installed" do
    expect(package("java")).to be_installed
  end

end

describe "container specs" do
	before(:all) do
		image = Docker::Image.build_from_dir('.')
		@container = image.run()

		set :os, family: :alpine
		set :backend, :Docker
		set :docker_container, @container.id
	end

	describe port(9090), wait: { timeout: 5 } do
		RSpec::Wait::wait_for { should be_listening }
		it { should be_listening }
	end

	after(:all) do
		@container.kill
		@container.delete(:force => true)
	end
end

